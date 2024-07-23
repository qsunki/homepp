package ssafy.age.backend.cam.web;

import lombok.Data;

@Data
public class CamResponseDto {
    private Long id;//TODO: camId
    private String name;
    private Long homeId;//TODO: home삭제
}
