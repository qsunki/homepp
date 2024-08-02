package ssafy.age.backend.cam.web;

import lombok.Data;

@Data
public class StreamResponseDto {
    String key;

    public StreamResponseDto(String key) {
        this.key = key;
    }
}
