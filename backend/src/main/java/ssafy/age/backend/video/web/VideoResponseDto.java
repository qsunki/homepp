package ssafy.age.backend.video.web;

import lombok.Data;
import ssafy.age.backend.event.persistence.EventType;

@Data
public class VideoResponseDto {
    private Long camId;
    private Long eventId;
    private EventType type;
    private String thumbnail;
}
