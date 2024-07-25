package ssafy.age.backend.notification.web;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ssafy.age.backend.notification.service.FCMService;
import ssafy.age.backend.notification.service.FCMTokenDto;

@RestController("/api/v1")
@RequiredArgsConstructor
public class FCMController {

    private final FCMService fcmService;

    @PostMapping("/members/{email}/tokens")
    public FCMTokenDto registerToken(@RequestBody FCMTokenDto token) {
        return fcmService.save(token.getToken());
    }
}
