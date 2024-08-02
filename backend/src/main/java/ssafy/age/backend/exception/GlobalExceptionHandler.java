package ssafy.age.backend.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ssafy.age.backend.auth.exception.InvalidTokenException;
import ssafy.age.backend.auth.exception.TokenNotFoundException;
import ssafy.age.backend.cam.exception.CamDeleteException;
import ssafy.age.backend.cam.exception.CamNotFoundException;
import ssafy.age.backend.cam.exception.InvalidURLException;
import ssafy.age.backend.cam.exception.JsonParsingException;
import ssafy.age.backend.event.exception.EventNotFoundException;
import ssafy.age.backend.member.exception.MemberDuplicateEntityException;
import ssafy.age.backend.member.exception.MemberInvalidAccessException;
import ssafy.age.backend.member.exception.MemberNotFoundException;
import ssafy.age.backend.share.exception.AccessDeniedException;
import ssafy.age.backend.share.exception.SharedMemberNotFoundException;
import ssafy.age.backend.video.exception.VideoNotFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // global exceptions
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleException(Exception e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    @ExceptionHandler(InvalidInputException.class)
    public ProblemDetail handleException(InvalidInputException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    //member exceptions
    @ExceptionHandler(MemberNotFoundException.class)
    public ProblemDetail handleException(MemberNotFoundException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(MemberDuplicateEntityException.class)
    public ProblemDetail handleException(MemberDuplicateEntityException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(MemberInvalidAccessException.class)
    public ProblemDetail handleException(MemberInvalidAccessException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, e.getMessage());
    }

    // auth exceptions
    @ExceptionHandler(InvalidTokenException.class)
    public ProblemDetail handleException(InvalidTokenException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, e.getMessage());
    }

    @ExceptionHandler(TokenNotFoundException.class)
    public ProblemDetail handleException(TokenNotFoundException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    }

    // share exceptions
    @ExceptionHandler(SharedMemberNotFoundException.class)
    public ProblemDetail handleException(SharedMemberNotFoundException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail handleException(AccessDeniedException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_ACCEPTABLE, e.getMessage());
    }

    // event exceptions
    @ExceptionHandler(EventNotFoundException.class)
    public ProblemDetail handleException(EventNotFoundException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    }

    // video exceptions
    @ExceptionHandler(VideoNotFoundException.class)
    public ProblemDetail handleException(VideoNotFoundException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    }

    // cam exceptions
    @ExceptionHandler(CamNotFoundException.class)
    public ProblemDetail handleException(CamNotFoundException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(CamDeleteException.class)
    public ProblemDetail handleException(CamDeleteException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    @ExceptionHandler(InvalidURLException.class)
    public ProblemDetail handleException(InvalidURLException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(JsonParsingException.class)
    public ProblemDetail handleException(JsonParsingException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }
}
