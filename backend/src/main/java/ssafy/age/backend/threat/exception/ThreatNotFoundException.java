package ssafy.age.backend.threat.exception;

import org.springframework.http.HttpStatus;
import ssafy.age.backend.exception.BusinessException;

public class ThreatNotFoundException extends BusinessException {
    public ThreatNotFoundException(Throwable cause) {
        super("해당 위협이 존재하지 않습니다", HttpStatus.NOT_FOUND, cause);
    }

    public ThreatNotFoundException() {
        super("해당 위협이 존재하지 않습니다", HttpStatus.NOT_FOUND);
    }
}
