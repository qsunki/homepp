package ssafy.age.backend.cam.web;

import lombok.Data;
import ssafy.age.backend.cam.persistence.CamStatus;

@Data
public class CamRequestDto {
    private String name;
    private String ip;
    private CamStatus status;
    private Long homeId;
}
