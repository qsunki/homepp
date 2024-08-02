package ssafy.age.backend.auth.exception;

import org.springframework.http.HttpStatus;
import ssafy.age.backend.exception.BusinessException;

public class InvalidTokenException extends BusinessException {
    public InvalidTokenException(Throwable cause) {
        super("유효하지 않은 토큰입니다.", HttpStatus.UNAUTHORIZED, cause);
    }
    public InvalidTokenException() {
        super("유효하지 않은 토큰입니다.", HttpStatus.UNAUTHORIZED);
    }
}
