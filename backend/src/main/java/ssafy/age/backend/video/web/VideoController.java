package ssafy.age.backend.video.web;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ssafy.age.backend.event.persistence.EventType;
import ssafy.age.backend.video.service.VideoService;
import ssafy.age.backend.video.service.VideoTimeInfo;

@Slf4j
@RestController
@RequestMapping("/api/v1/cams")
@RequiredArgsConstructor
public class VideoController {
    private static final MediaType VIDEO_TYPE = MediaType.valueOf("video/mp4");
    private final VideoService videoService;

    @GetMapping("/videos")
    public List<VideoResponseDto> getAllVideos(
            @RequestParam(required = false) List<EventType> types,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            @RequestParam(required = false) Long camId,
            @RequestParam(required = false) boolean isThreat) {
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
    public ResponseEntity<ResourceRegion> streamVideo(
            @PathVariable Long videoId, @RequestHeader HttpHeaders headers) {
        ResourceRegion region = videoService.getVideoResourceRegion(videoId, headers.getRange());

        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .cacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES))
                .contentType(VIDEO_TYPE)
                .header("Accept-Ranges", "bytes")
                .eTag(region.getResource().getFilename())
                .body(region);
    }

    @GetMapping("/videos/{videoId}/download")
    public ResponseEntity<Resource> downloadVideo(@PathVariable Long videoId) {
        Resource resource = videoService.getVideoResource(videoId);
        return ResponseEntity.ok()
                .contentType(VIDEO_TYPE)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PostMapping("/{camId}/videos/record")
    public VideoRecordResponseDto recordRequest(
            @PathVariable Long camId, @RequestBody VideoRecordRequestDto videoRecordRequestDto) {
        return videoService.recordVideo(
                camId, videoRecordRequestDto.getKey(), videoRecordRequestDto.getCommand());
    }

    @PostMapping("/{camId}/videos")
    public void saveVideoOnServer(
            @PathVariable Long camId,
            @RequestPart MultipartFile file,
            @RequestPart VideoTimeInfo timeInfo) {
        videoService.saveVideo(camId, file, timeInfo.getStartTime(), timeInfo.getEndTime());
    }

    @PostMapping("/{videoId}/threat")
    public void registerThreat(@PathVariable Long videoId) {
        videoService.registerThreat(videoId);
    }
}
