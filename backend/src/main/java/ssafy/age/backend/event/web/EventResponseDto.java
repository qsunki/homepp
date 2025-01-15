package ssafy.age.backend.event.web;

import java.time.LocalDateTime;
import ssafy.age.backend.event.persistence.EventType;

public record EventResponseDto(
        Long eventId,
        LocalDateTime occurredAt,
        EventType type,
        Long camId,
        Long videoId,
        String camName,
        Boolean isRead) {}
