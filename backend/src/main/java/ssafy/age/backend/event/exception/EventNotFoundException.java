package ssafy.age.backend.event.exception;

import org.springframework.http.HttpStatus;
import ssafy.age.backend.exception.BusinessException;

public class EventNotFoundException extends BusinessException {
    public EventNotFoundException(Throwable cause) {
        super("해당 이벤트가 존재하지 않습니다.", HttpStatus.NOT_FOUND, cause);
    }

    public EventNotFoundException() {
        super("해당 이벤트가 존재하지 않습니다.", HttpStatus.NOT_FOUND);
    }
}
