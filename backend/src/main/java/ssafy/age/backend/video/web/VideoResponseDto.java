package ssafy.age.backend.video.web;

import java.time.LocalDateTime;
import java.util.List;

public record VideoResponseDto(
        Long videoId,
        String camName,
        LocalDateTime recordStartedAt,
        Boolean isThreat,
        Long length,
        List<EventDetailDto> events,
        String thumbnailUrl,
        String downloadUrl,
        String streamUrl) {}
