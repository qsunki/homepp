package ssafy.age.backend.video.web;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ssafy.age.backend.event.persistence.EventType;
import ssafy.age.backend.video.service.DownloadResponseDto;
import ssafy.age.backend.video.service.StreamResponseDto;
import ssafy.age.backend.video.service.VideoService;
import ssafy.age.backend.video.service.VideoTimeInfo;

@Slf4j
@RestController
@RequestMapping("/api/v1/cams")
@RequiredArgsConstructor
public class VideoController {
    private final VideoService videoService;

    @GetMapping("/videos")
    public List<VideoResponseDto> getAllVideos(
            @RequestParam List<EventType> types,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate,
            @RequestParam Long camId,
            @RequestParam boolean isThreat) {
        return videoService.getAllVideos(types, startDate, endDate, camId, isThreat);
    }

    @GetMapping("/videos/{videoId}")
    public VideoResponseDto getVideoById(@PathVariable Long videoId) {
        return videoService.getVideoById(videoId);
    }

    @DeleteMapping("/videos/{videoId}")
    public void deleteVideo(@PathVariable Long videoId) {
        videoService.deleteVideo(videoId);
    }

    @GetMapping("/videos/{videoId}/stream")
    public ResponseEntity<Resource> streamVideo (
            @PathVariable Long videoId, HttpServletRequest request) {
        StreamResponseDto streamResponseDto = videoService.streamVideo(videoId, request.getHeader(HttpHeaders.RANGE));
        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .headers(streamResponseDto.getHeaders())
                .contentType(MediaType.valueOf("video/mp4"))
                .contentLength(streamResponseDto.getContentLength())
                .body(streamResponseDto.getResourceData());
    }

    @GetMapping("/videos/{videoId}/download")
    public ResponseEntity<Resource> downloadVideo(@PathVariable Long videoId) {
        DownloadResponseDto downloadResponseDto = videoService.downloadVideo(videoId);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + downloadResponseDto.getFilename() + "\"")
                .body(downloadResponseDto.getVideoResource());
    }

    @PostMapping("/{camId}/videos")
    public Long recordVideo(
            @PathVariable Long camId, @RequestBody VideoRecordRequestDto videoRecordRequestDto) {
        return videoService.recordVideo(
                camId, videoRecordRequestDto.getVideoId(), videoRecordRequestDto.getCommand());
    }

    @PostMapping("/{camId}/videos/{videoId}")
    public void saveVideoOnServer(
            @PathVariable Long camId,
            @PathVariable Long videoId,
            @RequestPart MultipartFile file,
            @RequestPart VideoTimeInfo timeInfo) {
        videoService.saveVideoOnServer(camId, videoId, file, timeInfo);
    }
}
