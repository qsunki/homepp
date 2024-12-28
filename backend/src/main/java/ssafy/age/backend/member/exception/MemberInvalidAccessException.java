package ssafy.age.backend.member.exception;

import org.springframework.http.HttpStatus;
import ssafy.age.backend.exception.BusinessException;

public class MemberInvalidAccessException extends BusinessException {
    public MemberInvalidAccessException() {
        super("잘못된 접근입니다.", HttpStatus.UNAUTHORIZED);
    }
}
