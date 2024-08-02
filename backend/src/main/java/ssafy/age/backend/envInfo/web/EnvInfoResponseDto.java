package ssafy.age.backend.envInfo.web;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class EnvInfoResponseDto {
    LocalDateTime recordedAt;
    Double temperature;
    Double humidity;

    public EnvInfoResponseDto(LocalDateTime recordedAt, Double temperature, Double humidity) {
        this.recordedAt = recordedAt;
        this.temperature = temperature;
        this.humidity = humidity;
    }
}
