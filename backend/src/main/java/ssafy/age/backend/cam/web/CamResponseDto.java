package ssafy.age.backend.cam.web;

import lombok.Data;

@Data
public class CamResponseDto {
    private Long camId;
    private String name;
    private String thumbnailUrl;
}
