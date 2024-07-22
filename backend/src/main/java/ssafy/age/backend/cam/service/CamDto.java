package ssafy.age.backend.cam.service;

import lombok.Data;
import ssafy.age.backend.cam.persistence.CamStatus;

@Data
public class CamDto {
    private Long id;
    private String name;
    private String ip;
    private CamStatus status;
    private Long homeId;
}
