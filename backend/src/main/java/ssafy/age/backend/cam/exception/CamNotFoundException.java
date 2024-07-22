package ssafy.age.backend.cam.exception;

public class CamNotFoundException extends RuntimeException {
    public CamNotFoundException() {
        super("해당 캠이 존재하지 않습니다.");
    }
}
