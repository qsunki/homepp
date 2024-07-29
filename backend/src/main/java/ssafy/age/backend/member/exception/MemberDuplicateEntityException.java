package ssafy.age.backend.member.exception;

public class MemberDuplicateEntityException extends RuntimeException {
    public MemberDuplicateEntityException() {
        super("이미 사용중인 이메일입니다.");
    }
}
