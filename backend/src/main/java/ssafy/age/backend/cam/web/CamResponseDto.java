package ssafy.age.backend.cam.web;

import lombok.Data;
import ssafy.age.backend.cam.persistence.CamStatus;

@Data
public class CamResponseDto {
    private Long id;
    private String name;
    private Long homeId;
}
