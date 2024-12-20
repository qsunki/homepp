package ssafy.age.backend.video.web;

import java.time.LocalDateTime;
import lombok.Data;
import ssafy.age.backend.event.persistence.EventType;

@Data
public class EventDetailDto {
    private EventType type;
    private LocalDateTime occurredAt;
}
