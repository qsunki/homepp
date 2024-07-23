package ssafy.age.backend.notification.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import ssafy.age.backend.notification.service.FCMService;
import ssafy.age.backend.notification.service.FCMTokenDto;

@Controller
//TODO: URL 수정
public class FCMController {

    private FCMService fcmService;

    @PostMapping("/tokens")
    public FCMTokenDto sendToken(@RequestBody FCMTokenDto token) {
        fcmService.save(token);
        return token;
    }
}
