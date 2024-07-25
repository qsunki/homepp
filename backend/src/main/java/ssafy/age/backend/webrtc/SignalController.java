package ssafy.age.backend.webrtc;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class SignalController {

    @MessageMapping("/{camId}")
    @SendTo("/topic/{camId}")
    public SignalMessage signal(SignalMessage message) {
        return message;
    }
}