package ssafy.age.backend.video.web;

import lombok.Data;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.event.persistence.EventType;

import java.util.List;

@Data
public class VideoResponseDto {
    private Long videoId;
    private String camName;
    private String recordStartAt;
    private boolean isThreat;
    private Long length;
    private List<EventDetailDto> eventDetails;
    private String thumbnailUrl;
}
