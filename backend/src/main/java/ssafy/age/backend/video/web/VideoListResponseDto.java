package ssafy.age.backend.video.web;

import lombok.Data;

@Data
public class VideoListResponseDto {
    private Long camId;
    private Long eventId;
    private String type;
    private String thumbnail;
}
