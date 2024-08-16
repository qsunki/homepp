package ssafy.age.backend.threat.web;

import java.util.List;
import lombok.Data;
import ssafy.age.backend.event.persistence.EventType;

@Data
public class ThreatResponseDto {
    private Boolean isRead;
    private String recordStartedAt;
    private String region;
    private List<EventType> eventTypes;
    private Long threatId;
}
