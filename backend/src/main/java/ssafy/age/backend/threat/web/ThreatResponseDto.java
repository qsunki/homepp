package ssafy.age.backend.threat.web;

import java.util.List;
import lombok.Data;
import ssafy.age.backend.video.web.EventDetailDto;

@Data
public class ThreatResponseDto {
    private Boolean isRead;
    private String recordStartAt;
    private String region;
    private List<EventDetailDto> eventDetails;
}
