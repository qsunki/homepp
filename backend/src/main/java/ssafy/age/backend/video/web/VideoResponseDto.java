package ssafy.age.backend.video.web;

import java.util.List;
import lombok.Data;

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
