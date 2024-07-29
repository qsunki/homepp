package ssafy.age.backend.envInfo.service;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class EnvInfoDto {
    private Long camId;
    private RecordStatus status;
    private double temperature;
    private double humidity;
    private LocalDateTime recordedAt;
}
