package ssafy.age.backend.cam.web;

import lombok.Data;

@Data
public class CamResponseDto {
    private Long camId;
    private String name;
    private String thumbnailUrl;

    public CamResponseDto(Long camId, String name, String thumbnailUrl) {
        this.camId = camId;
        this.name = name;
        this.thumbnailUrl = thumbnailUrl;
    }
}
