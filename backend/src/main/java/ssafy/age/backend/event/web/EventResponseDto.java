package ssafy.age.backend.event.web;

import java.time.LocalDateTime;
import lombok.Data;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.event.persistence.EventType;
import ssafy.age.backend.video.persistence.Video;

@Data
public class EventResponseDto {
    private LocalDateTime occurredAt;
    private EventType type;
    private Cam cam;
    private Video video;
    private boolean isRead;
}
