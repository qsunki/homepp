package ssafy.age.backend.video.service;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class VideoTimeInfo {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
