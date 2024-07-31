package ssafy.age.backend.video.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ssafy.age.backend.cam.exception.CamNotFoundException;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.persistence.CamRepository;
import ssafy.age.backend.envInfo.mqtt.CamMqttGateway;
import ssafy.age.backend.event.persistence.EventType;
import ssafy.age.backend.exception.InvalidInputException;
import ssafy.age.backend.video.exception.VideoNotFoundException;
import ssafy.age.backend.video.persistence.Video;
import ssafy.age.backend.video.persistence.VideoRepository;
import ssafy.age.backend.video.web.EventDetailDto;
import ssafy.age.backend.video.web.VideoResponseDto;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository videoRepository;
    private final VideoMapper videoMapper = VideoMapper.INSTANCE;
    private final CamRepository camRepository;
    private final CamMqttGateway camMqttGateway;

    @Value("${file.dir}")
    private String fileDir;

    public List<VideoResponseDto> getAllVideos(
            List<EventType> types,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long camId,
            boolean isThreat) {

        List<Video> videoList =
                videoRepository.findAllVideos(types, startDate, endDate, camId, isThreat);

        return videoList.stream()
                .map(
                        video -> {
                            VideoResponseDto dto = videoMapper.toVideoResponseDto(video);

                            List<EventDetailDto> eventDetails =
                                    video.getEventList().stream()
                                            .map(videoMapper::toEventDetailDto)
                                            .collect(Collectors.toList());
                            dto.setEventDetails(eventDetails);

                            video.getEventList().stream()
                                    .findFirst()
                                    .ifPresent(event -> dto.setCamName(event.getCam().getName()));

                            return dto;
                        })
                .collect(Collectors.toList());
    }

    public VideoResponseDto getVideoById(Long videoId) {

        Video video = videoRepository.findById(videoId).orElseThrow(VideoNotFoundException::new);

        VideoResponseDto dto = videoMapper.toVideoResponseDto(video);

        List<EventDetailDto> eventDetails =
                video.getEventList().stream()
                        .map(videoMapper::toEventDetailDto)
                        .collect(Collectors.toList());
        dto.setEventDetails(eventDetails);

        video.getEventList().stream()
                .findFirst()
                .ifPresent(event -> dto.setCamName(event.getCam().getName()));

        return dto;
    }

    public void deleteVideo(Long videoId) {
        videoRepository.deleteById(videoId);
    }

    public ResponseEntity<Resource> downloadVideo(Long videoId) {
        try {
            Video video = videoRepository.findById(videoId).orElseThrow(VideoNotFoundException::new);
            // 비디오 파일 경로를 가져옵니다
            Path videoPath = Paths.get(video.getUrl());

            // 비디오 파일을 리소스로 읽어옵니다
            Resource videoResource = new UrlResource(videoPath.toUri());

            // 다운로드 헤더를 추가합니다
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + videoPath.getFileName().toString() + "\"")
                    .body(videoResource);
        } catch (Exception e) {
            throw new RuntimeException();
        }
    }

    public ResponseEntity<Resource> streamVideo(Long videoId, HttpServletRequest request) {
        try {
            Video video = videoRepository.findById(videoId).orElseThrow(VideoNotFoundException::new);
            // 비디오 파일 경로를 가져옵니다
            Path videoPath = Paths.get(video.getUrl());

            // 비디오 파일을 리소스로 읽어옵니다
            Resource videoResource = new UrlResource(videoPath.toUri());

            // HTTP Range 헤더를 처리하여 스트리밍을 구현합니다
            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .contentType(MediaType.valueOf("video/mp4"))
                    .body(videoResource);
        } catch (Exception e) {
            throw new RuntimeException();
        }
    }

    @Transactional
    public void saveVideoOnServer(
            Long camId, Long videoId, MultipartFile file, VideoTimeInfo timeInfo) {
        try {
            Path path = Paths.get(fileDir + "videos" + "\\" + "cam" + camId +
                    "\\" + "video" + videoId + "\\" + file.getOriginalFilename());

            StringBuffer dirPath = new StringBuffer(fileDir);
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

            long seconds = ChronoUnit.SECONDS.between(timeInfo.getStartTime(), timeInfo.getEndTime());
            long minutes = ChronoUnit.MINUTES.between(timeInfo.getStartTime(), timeInfo.getEndTime());
            long hours = ChronoUnit.HOURS.between(timeInfo.getStartTime(), timeInfo.getEndTime());
            long videoLength = seconds + minutes * 60 + hours * 60 * 60;

            Video video = videoRepository.findById(videoId)
                    .orElseThrow(VideoNotFoundException::new);
            video.updateVideo(resource.getFile().getPath(), timeInfo.getStartTime(), timeInfo.getEndTime(), videoLength);
            Cam cam = camRepository.findById(camId)
                    .orElseThrow(CamNotFoundException::new);
            cam.addVideo(video);
            camRepository.save(cam);
        } catch (Exception e) {
            throw new CamNotFoundException();
        }
    }

    public Long recordVideo(Long camId, Long videoId, VideoCommand command) {
        Cam cam = camRepository.findById(camId).orElseThrow(CamNotFoundException::new);
        if (command == VideoCommand.START) {
            Video video = Video.builder().cam(cam).build();
            videoRepository.save(video);
            camMqttGateway.sendToMqtt(video.getId() + " start",
                    "cams/" + cam.getId() + "/video");
            return video.getId();
        }
        else if (command == VideoCommand.END) {
            Video video = videoRepository.findById(videoId).orElseThrow(VideoNotFoundException::new);
            camMqttGateway.sendToMqtt(video.getId().toString() + " end",
                    "cams/" + cam.getId() + "/video");
            return video.getId();
        }
        else {
            throw new InvalidInputException();
        }
    }
}
