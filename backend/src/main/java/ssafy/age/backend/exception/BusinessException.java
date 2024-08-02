package ssafy.age.backend.exception;

import org.springframework.http.HttpStatus;


public class BusinessException extends RuntimeException {
    HttpStatus httpStatus;

    public BusinessException(String message, HttpStatus httpStatus, Throwable cause) {
        super(message, cause);
        this.httpStatus = httpStatus;
    }

    public BusinessException(String message) {
        super(message);
    }
}