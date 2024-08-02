package ssafy.age.backend.share.exception;

import org.springframework.http.HttpStatus;
import ssafy.age.backend.exception.BusinessException;

public class SharedMemberNotFoundException extends BusinessException {
    public SharedMemberNotFoundException(Throwable cause) {
        super("공유할 회원이 존재하지 않습니다.", HttpStatus.NOT_FOUND, cause);
    }
    public SharedMemberNotFoundException() {
        super("공유할 회원이 존재하지 않습니다.");
    }
}
