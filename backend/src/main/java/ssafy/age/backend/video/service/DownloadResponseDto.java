package ssafy.age.backend.video.service;

import lombok.Builder;
import lombok.Data;
import org.springframework.core.io.Resource;

@Data
@Builder
public class DownloadResponseDto {
    String filename;
    Resource videoResource;
}
