package ssafy.age.backend.envinfo.web;

import java.time.LocalDateTime;
import lombok.Data;
import ssafy.age.backend.envinfo.service.RecordStatus;

@Data
public class EnvInfoReceivedDto {
    private Long camId;
    private RecordStatus status;
    private Double temperature;
    private Double humidity;
    private LocalDateTime recordedAt;
}
