package ssafy.age.backend.video.exception;

import org.springframework.http.HttpStatus;
import ssafy.age.backend.exception.BusinessException;

public class VideoNotFoundException extends BusinessException {
    public VideoNotFoundException(Throwable cause) {
        super("해당 비디오가 존재하지 않습니다.", HttpStatus.NOT_FOUND, cause);
    }
    public VideoNotFoundException() {
        super("해당 비디오가 존재하지 않습니다.", HttpStatus.NOT_FOUND);
    }
}
