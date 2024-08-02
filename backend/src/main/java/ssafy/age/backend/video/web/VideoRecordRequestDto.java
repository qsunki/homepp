package ssafy.age.backend.video.web;

import lombok.Data;
import ssafy.age.backend.video.service.VideoCommand;

@Data
public class VideoRecordRequestDto {
    private Long videoId;
    private VideoCommand command;
}
