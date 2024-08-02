package ssafy.age.backend.member.exception;

import org.springframework.http.HttpStatus;
import ssafy.age.backend.exception.BusinessException;

public class MemberNotFoundException extends BusinessException {
    public MemberNotFoundException(Throwable cause) {
        super("해당 멤버가 존재하지 않습니다.", HttpStatus.NOT_FOUND, cause);
    }
    public MemberNotFoundException() {
        super("해당 멤버가 존재하지 않습니다.", HttpStatus.NOT_FOUND);
    }
}
