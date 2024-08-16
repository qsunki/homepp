package ssafy.age.backend.video.service;

import lombok.Builder;
import lombok.Data;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;

@Data
@Builder
public class StreamResponseDto {
    HttpHeaders headers;
    Long contentLength;
    Resource resourceData;
}
