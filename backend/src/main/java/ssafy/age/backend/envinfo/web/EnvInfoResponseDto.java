package ssafy.age.backend.envinfo.web;

import java.time.LocalDateTime;
import ssafy.age.backend.envinfo.persistence.RecordStatus;

public record EnvInfoResponseDto(LocalDateTime recordedAt, Double temperature, Double humidity, RecordStatus status) {}
