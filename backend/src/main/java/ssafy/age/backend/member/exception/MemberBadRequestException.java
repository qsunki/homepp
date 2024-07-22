package ssafy.age.backend.member.exception;

public class MemberBadRequestException extends RuntimeException{
    public MemberBadRequestException() {
        super("잘못된 접근입니다.");
    }
}
