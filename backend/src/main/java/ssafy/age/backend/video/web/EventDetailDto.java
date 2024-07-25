package ssafy.age.backend.video.web;

import ssafy.age.backend.event.persistence.EventType;
import java.time.LocalDateTime;

public class EventDetailDto {

    private LocalDateTime occurredAt;
    private EventType type;
}
