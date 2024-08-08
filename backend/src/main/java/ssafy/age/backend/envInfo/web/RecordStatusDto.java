package ssafy.age.backend.envInfo.web;

import lombok.Data;
import ssafy.age.backend.envInfo.service.RecordStatus;

@Data
public class RecordStatusDto {
    private Long CamId;
    private RecordStatus status;
}
