package ssafy.age.backend.share.exception;

import org.springframework.http.HttpStatus;
import ssafy.age.backend.exception.BusinessException;

public class AccessDeniedException extends BusinessException {
    public AccessDeniedException(Throwable cause) {
        super("로그인된 회원과 이메일이 일치하지 않습니다.", HttpStatus.NOT_ACCEPTABLE, cause);
    }
    public AccessDeniedException() {
        super("로그인된 회원과 이메일이 일치하지 않습니다.", HttpStatus.NOT_ACCEPTABLE);
    }
}
