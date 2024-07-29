package ssafy.age.backend.video.web;

import java.time.LocalDateTime;
import ssafy.age.backend.event.persistence.EventType;

public class EventDetailDto {

    private LocalDateTime occurredAt;
    private EventType type;
}
