package ssafy.age.backend.envinfo.web;

import lombok.Data;
import ssafy.age.backend.envinfo.persistence.RecordStatus;

@Data
public class RecordStatusDto {
    private Long camId;
    private RecordStatus status;

    public RecordStatusDto(Long camId, RecordStatus status) {
        this.camId = camId;
        this.status = status;
    }
}
