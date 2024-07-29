package ssafy.age.backend.video.service;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VideoTimeInfo {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
