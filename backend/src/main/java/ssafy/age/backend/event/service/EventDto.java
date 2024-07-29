package ssafy.age.backend.event.service;

import java.time.LocalDateTime;
import lombok.Data;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.event.persistence.EventType;
import ssafy.age.backend.video.persistence.Video;

@Data
public class EventDto {
    private Long id;
    private LocalDateTime occurredAt;
    private EventType type;
    private boolean isRead;
    private boolean isThreat;
    private Cam cam;
    private Video video;
}
