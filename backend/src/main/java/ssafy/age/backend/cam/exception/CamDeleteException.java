package ssafy.age.backend.cam.exception;

public class CamDeleteException extends RuntimeException {
    public CamDeleteException() {
        super("캠 삭제 도중 예외가 발생했습니다.");
    }
}
