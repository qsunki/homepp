package ssafy.age.backend.webrtc;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SignalMessage {

    private String type;
    private String data;

    public SignalMessage(String type, String data) {
        this.type = type;
        this.data = data;
    }
}
