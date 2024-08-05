package ssafy.age.backend.video.web;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class VideoResponseDto {
    private Long videoId;
    private String camName;
    private LocalDateTime recordStartedAt;
    private Boolean isThreat;
    private Long length;
    private List<EventDetailDto> events;
    private String thumbnailUrl;
}
