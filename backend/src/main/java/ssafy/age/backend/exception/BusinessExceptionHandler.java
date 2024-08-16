package ssafy.age.backend.exception;

import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class BusinessExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ProblemDetail handleException(BusinessException e) {
        return ProblemDetail.forStatusAndDetail(e.getHttpStatus(), e.getMessage());
    }
}
