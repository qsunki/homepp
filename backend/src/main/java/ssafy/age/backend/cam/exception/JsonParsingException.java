package ssafy.age.backend.cam.exception;

import org.springframework.http.HttpStatus;
import ssafy.age.backend.exception.BusinessException;

public class JsonParsingException extends BusinessException {
    public JsonParsingException(Throwable cause) {
        super("OpenAPI JSON parsing 도중 예외 발생", HttpStatus.INTERNAL_SERVER_ERROR, cause);
    }

    public JsonParsingException() {
        super("OpenAPI JSON parsing 도중 예외 발생", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
