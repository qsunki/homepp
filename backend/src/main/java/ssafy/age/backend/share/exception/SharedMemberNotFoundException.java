package ssafy.age.backend.share.exception;

public class SharedMemberNotFoundException extends RuntimeException {
    public SharedMemberNotFoundException() {
        super("공유할 회원이 존재하지 않습니다.");
    }
}
