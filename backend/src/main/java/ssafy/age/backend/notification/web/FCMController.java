package ssafy.age.backend.notification.web;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.notification.service.FCMService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class FCMController {

    private final FCMService fcmService;

    @PostMapping("/members/{email}/tokens")
    public FCMTokenDto registerToken(@RequestBody FCMTokenDto token, @PathVariable String email) {
        return fcmService.save(token.getToken());
    }
}
