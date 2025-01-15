package ssafy.age.backend.envinfo.web;

import java.time.LocalDateTime;
import ssafy.age.backend.envinfo.persistence.RecordStatus;

public record EnvInfoReceivedDto(
        Long camId, RecordStatus status, Double temperature, Double humidity, LocalDateTime recordedAt) {}
