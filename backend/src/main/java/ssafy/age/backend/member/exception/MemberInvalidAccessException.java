package ssafy.age.backend.member.exception;

public class MemberInvalidAccessException extends RuntimeException {
    public MemberInvalidAccessException() {
        super("잘못된 접근입니다.");
    }
}
