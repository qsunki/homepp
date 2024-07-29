package ssafy.age.backend.exception;

public class InvalidInputException extends RuntimeException {
    public InvalidInputException() {
        super("잘못된 입력입니다.");
    }
}
