package ssafy.age.backend.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ssafy.age.backend.member.exception.MemberNotFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {


}
