package ssafy.age.backend.envinfo.web;

import lombok.Data;
import ssafy.age.backend.envinfo.service.RecordStatus;

@Data
public class RecordStatusDto {
    private Long CamId;
    private RecordStatus status;
}
