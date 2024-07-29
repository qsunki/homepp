package ssafy.age.backend.video.web;

import jakarta.servlet.http.HttpServletRequest;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.event.persistence.EventType;
import ssafy.age.backend.video.service.VideoService;

@Slf4j
@RestController
@RequestMapping("/api/v1/cams/videos")
@RequiredArgsConstructor
public class VideoController {
    private final VideoService videoService;

    @GetMapping
    public List<VideoResponseDto> getAllVideos(
            @RequestParam List<EventType> types,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate,
            @RequestParam Long camId,
            @RequestParam boolean isThreat) {
        return videoService.getAllVideos(types, startDate, endDate, camId, isThreat);
    }

    @GetMapping("/{videoId}")
    public VideoResponseDto getVideoById(@PathVariable Long videoId) {
        return videoService.getVideoById(videoId);
    }

    @DeleteMapping("/{videoId}")
    public void deleteVideo(@PathVariable Long videoId) {
        videoService.deleteVideo(videoId);
    }

    @GetMapping("/{videoId}/stream")
    public ResponseEntity<Resource> streamVideo(
            @PathVariable Long videoId, HttpServletRequest request) throws MalformedURLException {
        // 비디오 파일 경로를 가져옵니다
        Path videoPath = Paths.get("src/main/resources/videos", videoId.toString() + ".mp4");

        // 비디오 파일을 리소스로 읽어옵니다
        Resource videoResource = new UrlResource(videoPath.toUri());

        // HTTP Range 헤더를 처리하여 스트리밍을 구현합니다
        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .contentType(MediaType.valueOf("video/mp4"))
                .body(videoResource);
    }

    @GetMapping("/{videoId}/download")
    public ResponseEntity<Resource> downloadVideo(@PathVariable Long videoId)
            throws MalformedURLException {
        // 비디오 파일 경로를 가져옵니다
        Path videoPath = Paths.get("src/main/resources/videos", videoId.toString() + ".mp4");

        // 비디오 파일을 리소스로 읽어옵니다
        Resource videoResource = new UrlResource(videoPath.toUri());

        // 다운로드 헤더를 추가합니다
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + videoPath.getFileName().toString() + "\"")
                .body(videoResource);
    }
}
