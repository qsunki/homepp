package ssafy.age.backend.cam.exception;

public class JsonParsingException extends RuntimeException {
    public JsonParsingException() {
        super("OpenAPI JSON parsing 도중 예외 발생");
    }
}
