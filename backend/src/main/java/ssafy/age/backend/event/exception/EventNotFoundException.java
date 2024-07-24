package ssafy.age.backend.event.exception;

public class EventNotFoundException extends RuntimeException {
    public EventNotFoundException() {
        super("해당 이벤트가 존재하지 않습니다.");
    }
}
