package ssafy.age.backend.event.service;

import lombok.Data;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.event.persistence.EventType;
import ssafy.age.backend.video.persistence.Video;

import java.time.LocalDateTime;

@Data
public class EventDto {
    private Long id;
    private LocalDateTime occurredAt;
    private EventType type;
    private Cam cam;
    private Video video;
}
