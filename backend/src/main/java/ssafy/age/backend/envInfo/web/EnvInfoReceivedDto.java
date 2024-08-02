package ssafy.age.backend.envInfo.web;

import java.time.LocalDateTime;
import lombok.Data;
import ssafy.age.backend.envInfo.service.RecordStatus;

@Data
public class EnvInfoReceivedDto {
    private Long camId;
    private RecordStatus status;
    private Double temperature;
    private Double humidity;
    private LocalDateTime recordedAt;
}
