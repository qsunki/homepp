package ssafy.age.backend.video.web;

import java.time.LocalDateTime;
import ssafy.age.backend.event.persistence.EventType;

public record EventDetailDto(EventType type, LocalDateTime occurredAt) {}
