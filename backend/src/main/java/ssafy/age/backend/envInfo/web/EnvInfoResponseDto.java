package ssafy.age.backend.envInfo.web;

import java.time.LocalDateTime;
import lombok.Data;
import ssafy.age.backend.envInfo.service.RecordStatus;

@Data
public class EnvInfoResponseDto {
    LocalDateTime recordedAt;
    Double temperature;
    Double humidity;
    RecordStatus status;

    public EnvInfoResponseDto(
            LocalDateTime recordedAt, Double temperature, Double humidity, RecordStatus status) {
        this.recordedAt = recordedAt;
        this.temperature = temperature;
        this.humidity = humidity;
        this.status = status;
    }
}
