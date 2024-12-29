package ssafy.age.backend.envinfo.exception;

import org.springframework.http.HttpStatus;
import ssafy.age.backend.exception.BusinessException;

public class EnvInfoNotFoundException extends BusinessException {
    public EnvInfoNotFoundException(Throwable cause) {
        super("해당 환경정보가 존재하지 않습니다.", HttpStatus.NOT_FOUND, cause);
    }

    public EnvInfoNotFoundException() {
        super("해당 환경정보가 존재하지 않습니다.", HttpStatus.NOT_FOUND);
    }
}
