package ssafy.age.backend.envinfo.web;

import java.time.LocalDateTime;
import lombok.Data;
import ssafy.age.backend.envinfo.persistence.RecordStatus;

@Data
public class EnvInfoReceivedDto {
    private Long camId;
    private RecordStatus status;
    private Double temperature;
    private Double humidity;
    private LocalDateTime recordedAt;

    public EnvInfoReceivedDto(
            Long camId, RecordStatus status, Double temperature, Double humidity, LocalDateTime recordedAt) {
        this.camId = camId;
        this.status = status;
        this.temperature = temperature;
        this.humidity = humidity;
        this.recordedAt = recordedAt;
    }
}
