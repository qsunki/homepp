package ssafy.age.backend.video.service;

import jakarta.transaction.Transactional;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.HttpRange;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.service.CamService;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.event.persistence.EventRepository;
import ssafy.age.backend.event.persistence.EventType;
import ssafy.age.backend.file.FileStorage;
import ssafy.age.backend.member.exception.MemberInvalidAccessException;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberRepository;
import ssafy.age.backend.mqtt.Command;
import ssafy.age.backend.mqtt.MqttService;
import ssafy.age.backend.notification.service.FCMService;
import ssafy.age.backend.security.service.AuthService;
import ssafy.age.backend.threat.persistence.Threat;
import ssafy.age.backend.threat.persistence.ThreatRepository;
import ssafy.age.backend.video.exception.VideoNotFoundException;
import ssafy.age.backend.video.persistence.Video;
import ssafy.age.backend.video.persistence.VideoRepository;
import ssafy.age.backend.video.web.VideoRecordResponseDto;
import ssafy.age.backend.video.web.VideoResponseDto;

@Service
@RequiredArgsConstructor
@Slf4j
public class VideoService {
    private static final String THUMBNAIL = "thumbnail";
    private static final String STREAM = "stream";
    private static final String DOWNLOAD = "download";
    private static final String URL_PREFIX = "/api/v1/cams/videos";

    private final VideoRepository videoRepository;
    private final VideoMapper videoMapper = VideoMapper.INSTANCE;
    private final MqttService mqttService;
    private final FCMService fcmService;
    private final EventRepository eventRepository;
    private final FileStorage fileStorage;
    private final MemberRepository memberRepository;
    private final ThreatRepository threatRepository;
    private final AuthService authService;
    private final CamService camService;

    @Transactional
    public List<VideoResponseDto> getAllVideos(
            List<EventType> types,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long camId,
            Boolean isThreat,
            Long memberId) {
        List<Video> videos =
                videoRepository.findVideosByParams(
                        memberId, types, startDate, endDate, camId, isThreat);
        return videos.stream().map(videoMapper::toVideoResponseDto).toList();
    }

    @Transactional
    public VideoResponseDto getVideoById(Long videoId, Long memberId) {
        verifyMemberByVideoId(videoId, memberId);
        Video video = videoRepository.findById(videoId).orElseThrow(VideoNotFoundException::new);
        return videoMapper.toVideoResponseDto(video);
    }

    public void deleteVideo(Long videoId, Long memberId) {
        verifyMemberByVideoId(videoId, memberId);
        videoRepository.deleteById(videoId);
    }

    public Resource getVideoResource(Long videoId, Long memberId) {
        verifyMemberByVideoId(videoId, memberId);
        return fileStorage.loadVideoResource(videoId);
    }

    @Transactional
    public void saveVideo(
            Long camId,
            Long memberId,
            MultipartFile file,
            LocalDateTime startTime,
            LocalDateTime endTime) {
        camService.verifyMemberByCamId(camId, memberId);
        // 비디오 엔티티생성 및 이벤트 연관관계 매핑
        Duration duration = Duration.between(startTime, endTime);
        long videoLength = duration.getSeconds();

        List<Event> events = eventRepository.findAllByOccurredAtBetween(startTime, endTime);
        Cam cam = Cam.builder().id(camId).build();
        Video video =
                Video.builder()
                        .cam(cam)
                        .events(events)
                        .isThreat(false)
                        .length(videoLength)
                        .recordStartedAt(startTime)
                        .build();
        Video saved = videoRepository.save(video);

        // 녹화영상 저장
        fileStorage.saveVideo(saved.getId(), file);
        // 썸네일 생성 및 등록
        fileStorage.saveVideoThumbnail(saved.getId());

        String thumbnailUrl = URL_PREFIX + "/" + saved.getId() + "/" + THUMBNAIL;
        String streamUrl = URL_PREFIX + "/" + saved.getId() + "/" + STREAM;
        String downloadUrl = URL_PREFIX + "/" + saved.getId() + "/" + DOWNLOAD;
        saved.setThumbnailUrl(thumbnailUrl);
        saved.setStreamUrl(streamUrl);
        saved.setDownloadUrl(downloadUrl);
        videoRepository.save(saved);
    }

    public VideoRecordResponseDto recordVideo(
            Long camId, Long memberId, String key, VideoCommand command) {
        camService.verifyMemberByCamId(camId, memberId);
        if (command == VideoCommand.START) {
            key = UUID.randomUUID().toString();
            mqttService.requestRecord(camId, key, Command.START);
            return new VideoRecordResponseDto(key);
        }
        // when command == VideoCommand.END
        mqttService.requestRecord(camId, key, Command.END);
        return new VideoRecordResponseDto(key);
    }

    @Transactional
    public void registerThreat(Long videoId, Long memberId) {
        verifyMemberByVideoId(videoId, memberId);
        Video video = videoRepository.findById(videoId).orElseThrow(VideoNotFoundException::new);
        video.registerThreat();
        List<Member> members = memberRepository.findAll();
        for (Member member : members) {
            Threat threat = Threat.builder().member(member).video(video).isRead(false).build();
            threatRepository.save(threat);
        }
        Video savedVideo = videoRepository.save(video);
        fcmService.sendMessageToAll(savedVideo);
    }

    public ResourceRegion getVideoResourceRegion(
            Long videoId, Long memberId, List<HttpRange> ranges) {
        verifyMemberByVideoId(videoId, memberId);
        Resource resource = fileStorage.loadVideoResource(videoId);
        long chunkSize = 1024 * 1024;
        long contentLength;

        try {
            contentLength = resource.contentLength();
        } catch (IOException e) {
            throw new RuntimeException("video resource의 content length를 불러올 수 없습니다.", e);
        }

        HttpRange httpRange = getFirstRange(ranges);
        long start = getRangeStart(httpRange, contentLength);
        long end = getRangeEnd(httpRange, contentLength);
        long rangeLength = Long.min(chunkSize, end - start + 1);

        log.debug("Streaming start === {} , end == {}", start, end);
        return new ResourceRegion(resource, start, rangeLength);
    }

    private HttpRange getFirstRange(List<HttpRange> ranges) {
        return ranges.isEmpty() ? HttpRange.createByteRange(0) : ranges.getFirst();
    }

    private long getRangeStart(HttpRange httpRange, long contentLength) {
        try {
            return httpRange.getRangeStart(contentLength);
        } catch (Exception e) {
            return 0;
        }
    }

    private long getRangeEnd(HttpRange httpRange, long contentLength) {
        try {
            return httpRange.getRangeEnd(contentLength);
        } catch (Exception e) {
            return contentLength - 1;
        }
    }

    public Resource getVideoThumbnailResource(Long videoId, Long memberId) {
        verifyMemberByVideoId(videoId, memberId);
        return fileStorage.loadVideoThumbnailResource(videoId);
    }

    public void verifyMemberByVideoId(Long videoId, Long memberId) {
        Member member =
                memberRepository.findByVideoId(videoId).orElseThrow(VideoNotFoundException::new);
        if (!member.getId().equals(memberId)) {
            throw new MemberInvalidAccessException();
        }
    }
}
