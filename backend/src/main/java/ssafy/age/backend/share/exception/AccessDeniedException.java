package ssafy.age.backend.share.exception;

public class AccessDeniedException extends RuntimeException {
    public AccessDeniedException() {
        super("로그인된 회원과 이메일이 일치하지 않습니다.");
    }
}
