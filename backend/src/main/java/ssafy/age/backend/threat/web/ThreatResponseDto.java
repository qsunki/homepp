package ssafy.age.backend.threat.web;

import java.util.List;
import ssafy.age.backend.event.persistence.EventType;

public record ThreatResponseDto(
        Boolean isRead, String recordStartedAt, String region, List<EventType> eventTypes, Long threatId) {}
