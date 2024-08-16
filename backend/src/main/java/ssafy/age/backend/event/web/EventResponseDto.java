package ssafy.age.backend.event.web;

import java.time.LocalDateTime;
import lombok.Data;
import ssafy.age.backend.event.persistence.EventType;

@Data
public class EventResponseDto {
    private Long eventId;
    private LocalDateTime occurredAt;
    private EventType type;
    private Long camId;
    private Long videoId;
    private String camName;
    private Boolean isRead;
}
