package ssafy.age.backend.webrtc;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class SignalController {

    @MessageMapping("/cam/{key}")
    @SendTo("/sub/client/{key}")
    public String camToClient(@DestinationVariable("key") Long key, @Payload String message) {
        log.info("cam to client... key: {}, message: {}", key, message);
        return message;
    }

    @MessageMapping("/client/{key}")
    @SendTo("/sub/cam/{key}")
    public String clientToCam(@DestinationVariable("key") Long key, @Payload String message) {
        log.info("client to cam... key: {}, message: {}", key, message);
        return message;
    }

    @MessageMapping("/message")
    @SendTo("/sub/message")
    public String signal(String message) {
        log.info(message);
        return message;
    }
}
