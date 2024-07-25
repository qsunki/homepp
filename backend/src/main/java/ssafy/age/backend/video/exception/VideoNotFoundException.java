package ssafy.age.backend.video.exception;

public class VideoNotFoundException extends RuntimeException {
    public VideoNotFoundException() {
        super("해당 비디오가 존재하지 않습니다.");
    }
}
