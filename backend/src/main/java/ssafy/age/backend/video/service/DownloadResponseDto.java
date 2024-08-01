package ssafy.age.backend.video.service;

import lombok.Data;
import org.springframework.core.io.Resource;

@Data
public class DownloadResponseDto {
    String filename;
    Resource videoResource;
}
