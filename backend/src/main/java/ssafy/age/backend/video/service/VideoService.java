package ssafy.age.backend.video.service;

import jakarta.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jcodec.api.JCodecException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ssafy.age.backend.cam.exception.CamNotFoundException;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.persistence.CamRepository;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.event.persistence.EventType;
import ssafy.age.backend.exception.InvalidInputException;
import ssafy.age.backend.mqtt.MqttGateway;
import ssafy.age.backend.notification.service.FCMService;
import ssafy.age.backend.video.exception.VideoNotFoundException;
import ssafy.age.backend.video.persistence.Video;
import ssafy.age.backend.video.persistence.VideoRepository;
import ssafy.age.backend.video.web.ThumbnailExtractor;
import ssafy.age.backend.video.web.VideoResponseDto;

@Service
@RequiredArgsConstructor
@Slf4j
public class VideoService {

    private final VideoRepository videoRepository;
    private final VideoMapper videoMapper = VideoMapper.INSTANCE;
    private final CamRepository camRepository;
    private final MqttGateway mqttGateway;
    private final FCMService fcmService;

    @Value("${file.dir}")
    private String fileDir;

    @Transactional
    public List<VideoResponseDto> getAllVideos(
            List<EventType> types,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long camId,
            Boolean isThreat) {
        List<Video> videos =
                videoRepository.findVideosByParams(types, startDate, endDate, camId, isThreat);
        return videos.stream().map(videoMapper::toVideoResponseDto).toList();
    }

    @Transactional
    public VideoResponseDto getVideoById(Long videoId) {
        Video video = videoRepository.findById(videoId).orElseThrow(VideoNotFoundException::new);
        return videoMapper.toVideoResponseDto(video);
    }

    /*
     * TODO: 외래키 제약조건으로 삭제불가능한 것 수정하기
     */
    public void deleteVideo(Long videoId) {
        videoRepository.deleteById(videoId);
    }

    public DownloadResponseDto downloadVideo(Long videoId) {
        Video video = videoRepository.findById(videoId).orElseThrow(VideoNotFoundException::new);
        Path videoPath = Paths.get(video.getUrl());

        Resource videoResource;
        try {
            videoResource = new UrlResource(videoPath.toUri());
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }

        return DownloadResponseDto.builder()
                .filename(videoPath.getFileName().toString())
                .videoResource(videoResource)
                .build();
    }

    public StreamResponseDto streamVideo(Long videoId, String rangeHeader) {
        Video video = videoRepository.findById(videoId).orElseThrow(VideoNotFoundException::new);
        Path videoPath = Paths.get(video.getUrl());

        Resource videoResource;
        try {
            videoResource = new UrlResource(videoPath.toUri());
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }

        long videoLength = videoPath.toFile().length();

        if (rangeHeader == null) {
            return StreamResponseDto.builder()
                    .contentLength(videoLength)
                    .resourceData(videoResource)
                    .build();
        }

        String[] ranges = rangeHeader.replace("bytes=", "").split("-");
        long start = Long.parseLong(ranges[0]);
        long end = ranges.length > 1 ? Long.parseLong(ranges[1]) : videoLength - 1;

        if (end > videoLength - 1) {
            end = videoLength - 1;
        }

        long contentLength = end - start + 1;

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Range", "bytes " + start + "-" + end + "/" + videoLength);
        headers.add(HttpHeaders.ACCEPT_RANGES, "bytes");

        byte[] data = new byte[(int) contentLength];
        try (RandomAccessFile file = new RandomAccessFile(videoPath.toFile(), "r")) {
            file.seek(start);
            file.readFully(data);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return StreamResponseDto.builder()
                .headers(headers)
                .contentLength(contentLength)
                .resourceData(new ByteArrayResource(data))
                .build();
    }

    @Transactional
    public void saveVideoOnServer(
            Long camId, Long videoId, MultipartFile file, VideoTimeInfo timeInfo) {
        try {
            Path path =
                    Paths.get(
                            fileDir
                                    + "videos"
                                    + "\\"
                                    + "cam"
                                    + camId
                                    + "\\"
                                    + "video"
                                    + videoId
                                    + "\\"
                                    + file.getOriginalFilename());

            StringBuilder dirPath = new StringBuilder(fileDir);
            dirPath.append("videos");
            File directory = new File(dirPath.toString());
            if (!directory.exists()) {
                directory.mkdir();
            }
            dirPath.append("\\");
            dirPath.append("cam");
            dirPath.append(camId);
            directory = new File(dirPath.toString());
            if (!directory.exists()) {
                directory.mkdir();
            }
            dirPath.append("\\");
            dirPath.append("video");
            dirPath.append(videoId);
            directory = new File(dirPath.toString());
            if (!directory.exists()) {
                directory.mkdir();
            }

            Files.copy(file.getInputStream(), path);
            Resource resource = new FileSystemResource(path.toFile());

            File videoFile = resource.getFile();

            long videoLength =
                    ChronoUnit.SECONDS.between(timeInfo.getStartTime(), timeInfo.getEndTime());

            Video video =
                    videoRepository.findById(videoId).orElseThrow(VideoNotFoundException::new);
            Cam cam = camRepository.findById(camId).orElseThrow(CamNotFoundException::new);

            // 썸네일 생성
            String thumbnailFilePath =
                    createThumbnail(
                            resource.getFile().getPath(),
                            file.getOriginalFilename(),
                            dirPath.toString());

            video.updateVideo(
                    resource.getFile().getPath(),
                    timeInfo.getStartTime(),
                    timeInfo.getEndTime(),
                    videoLength,
                    thumbnailFilePath);

            cam.addVideo(video);
            camRepository.save(cam);
        } catch (Exception e) {
            log.error("비디오 서버에 안올라감: {}", e.getMessage());
            throw new CamNotFoundException();
        }
    }

    public Long recordVideo(Long camId, Long videoId, VideoCommand command) {
        Cam cam = camRepository.findById(camId).orElseThrow(CamNotFoundException::new);
        if (command == VideoCommand.START) {
            Video video = Video.builder().cam(cam).build();
            videoRepository.save(video);
            mqttGateway.sendToMqtt(video.getId() + " start", "cams/" + cam.getId() + "/video");
            return video.getId();
        } else if (command == VideoCommand.END) {
            Video video =
                    videoRepository.findById(videoId).orElseThrow(VideoNotFoundException::new);
            mqttGateway.sendToMqtt(
                    video.getId().toString() + " end", "cams/" + cam.getId() + "/video");
            return video.getId();
        } else {
            throw new InvalidInputException();
        }
    }

    public void registerThreat(Long videoId) {
        Video video = videoRepository.findById(videoId).orElseThrow(VideoNotFoundException::new);
        video.registerThreat();
        for (Event event : video.getEvents()) {
            fcmService.sendMessageToAll(
                    event.getType().toString() + " 알림",
                    event.getOccurredAt()
                            + " "
                            + event.getCam().getRegion()
                            + "지역 "
                            + event.getType()
                            + " 발생\n"
                            + "인근 지역 주민들은 주의 바랍니다.");
        }
    }

    private String createThumbnail(String videoFilePath, String originalFilename, String dirPath) {
        try {
            String thumbnailFilePath = dirPath + "\\" + originalFilename + ".png";
            ThumbnailExtractor.createThumbnail(videoFilePath, thumbnailFilePath, 2.0);
            return thumbnailFilePath;
        } catch (IOException | JCodecException | ArrayIndexOutOfBoundsException e) {
            log.error("썸네일 만들지 못함 : {}", e.getMessage());
            return null;
        }
    }
}
