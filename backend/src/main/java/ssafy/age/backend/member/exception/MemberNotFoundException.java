package ssafy.age.backend.member.exception;

public class MemberNotFoundException extends RuntimeException {
    public MemberNotFoundException() {
        super("해당 멤버가 존재하지 않습니다.");
    }
}
