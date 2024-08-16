package ssafy.age.backend.event.service;

import java.time.LocalDateTime;
import lombok.Data;
import ssafy.age.backend.event.persistence.EventType;

@Data
public class EventDto {
    private LocalDateTime occurredAt;
    private EventType type;
    private Long camId;
}
