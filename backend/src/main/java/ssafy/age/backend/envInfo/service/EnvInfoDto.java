package ssafy.age.backend.envInfo.service;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EnvInfoDto {
    private Long camId;
    private RecordStatus status;
    private double temperature;
    private double humidity;
    private LocalDateTime recordedAt;
}
