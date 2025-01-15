package ssafy.age.backend.notification.web;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.notification.service.FCMService;
import ssafy.age.backend.security.service.MemberInfoDto;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class FCMController {

    private final FCMService fcmService;

    @PostMapping("/members/{email}/tokens")
    public FCMTokenDto registerToken(
            @RequestBody FCMTokenDto token,
            @PathVariable String email,
            @AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        return fcmService.save(token.token(), memberInfoDto.memberId(), email);
    }
}
