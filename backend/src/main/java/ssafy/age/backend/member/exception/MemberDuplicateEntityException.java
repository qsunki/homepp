package ssafy.age.backend.member.exception;

import org.springframework.http.HttpStatus;
import ssafy.age.backend.exception.BusinessException;

public class MemberDuplicateEntityException extends BusinessException {
    public MemberDuplicateEntityException() {
        super("이미 사용중인 이메일입니다.", HttpStatus.CONFLICT);
    }
}
