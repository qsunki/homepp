package ssafy.age.backend.member.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.auth.service.AuthService;
import ssafy.age.backend.member.service.MemberService;

@Slf4j
@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final AuthService authService;

    @GetMapping
    public String getMemberEmail() {
        return authService.getMemberEmail();
    }

    @PostMapping
    public MemberResponseDto joinMember(@RequestBody @Valid MemberRequestDto memberRequestDto) {
        return authService.joinMember(memberRequestDto.getEmail(),
                                      memberRequestDto.getPassword(),
                                      memberRequestDto.getPhoneNumber());
    }

    @PatchMapping("/{email}")
    public MemberResponseDto updateMember(@RequestBody MemberRequestDto memberRequestDto) {
        return memberService.updateMember(memberRequestDto.getEmail(),
                                          memberRequestDto.getPassword(),
                                          memberRequestDto.getPhoneNumber());
    }

    @DeleteMapping("/{email}")
    public void deleteMember(@PathVariable String email) {
        memberService.deleteMember(email);
    }

    @GetMapping("/{email}")
    public MemberResponseDto findByEmail(@PathVariable String email) {
        return memberService.findByEmail(email);
    }

    // 사용할 수 있으면 true, 없으면 false
    @GetMapping("/emails/{email}")
    public boolean checkDuplicatedEmail(@PathVariable String email) {
        return memberService.checkDuplicatedEmail(email);
    }

    // 사용할 수 있으면 true, 없으면 false
    @GetMapping("/phone-numbers/{phoneNumber}")
    public boolean checkDuplicatedPhoneNumber(@PathVariable String phoneNumber) {
        return memberService.checkDuplicatedPhoneNumber(phoneNumber);
    }

    @PostMapping("/login")
    public TokenDto login(@RequestBody @Valid MemberRequestDto memberRequestDto) {
        return authService.login(memberRequestDto.getEmail(),
                                memberRequestDto.getPassword());
    }

    @PostMapping("/reissue")
    public TokenDto reissue(@RequestBody @Valid TokenDto tokenDto) {
        return authService.reissue(tokenDto.getRefreshToken());
    }

    @PostMapping("/logout")
    public void logout(@RequestBody @Valid TokenDto tokenDto) {
        authService.logout(tokenDto);
    }
}
