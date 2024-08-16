package ssafy.age.backend.exception;

import org.springframework.http.HttpStatus;

public class InvalidInputException extends BusinessException {
    public InvalidInputException(Throwable cause) {
        super("잘못된 입력입니다.", HttpStatus.BAD_REQUEST, cause);
    }

    public InvalidInputException() {
        super("잘못된 입력입니다.", HttpStatus.BAD_REQUEST);
    }
}
