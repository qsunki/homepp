package ssafy.age.backend.notification.exception;

import org.springframework.http.HttpStatus;
import ssafy.age.backend.exception.BusinessException;

public class FCMTokenNotFoundException extends BusinessException {
    public FCMTokenNotFoundException(Throwable cause) {
        super("FCM 토큰을 찾을 수 없습니다.", HttpStatus.NOT_FOUND, cause);
    }

    public FCMTokenNotFoundException() {
        super("FCM 토큰을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
    }
}
