package ssafy.age.backend.cam.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ssafy.age.backend.cam.persistence.CamStatus;

@Data
public class CamRequestDto {
    private String name;
    private String ip;
    private CamStatus status;
    private Long homeId;
}
