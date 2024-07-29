package ssafy.age.backend.auth.exception;

public class TokenNotFoundException extends RuntimeException {
    public TokenNotFoundException() {
        super("refresh token이 유효하지 않습니다.");
    }
}
