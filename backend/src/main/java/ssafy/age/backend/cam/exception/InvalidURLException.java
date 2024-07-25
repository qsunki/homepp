package ssafy.age.backend.cam.exception;

public class InvalidURLException extends RuntimeException {
    public InvalidURLException() {
        super("잘못된 URL입니다.");
    }
}
