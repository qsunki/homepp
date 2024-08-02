package ssafy.age.backend.auth.exception;

import org.springframework.http.HttpStatus;
import ssafy.age.backend.exception.BusinessException;

public class TokenNotFoundException extends BusinessException {
    public TokenNotFoundException(Throwable cause) {
        super("refresh token이 유효하지 않습니다.", HttpStatus.UNAUTHORIZED, cause);
    }
    public TokenNotFoundException() {
        super("refresh token이 유효하지 않습니다.", HttpStatus.UNAUTHORIZED);
    }
}
