package ssafy.age.backend.member.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.auth.service.AuthService;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.service.MemberDto;
import ssafy.age.backend.member.service.MemberMapper;
import ssafy.age.backend.member.service.MemberService;

@Slf4j
@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final AuthService authService;
    private final MemberMapper memberMapper = MemberMapper.INSTANCE;

    @GetMapping
    public String getMemberEmail() {
        return authService.getMemberEmail();
    }

    @PostMapping
    public MemberResponseDto joinMember(@RequestBody @Valid MemberRequestDto memberRequestDto) {
        return authService.joinMember(memberMapper.toMemberDto(memberRequestDto));
    }

    @PatchMapping("/{email}")
    public MemberResponseDto updateMember(@RequestBody MemberRequestDto memberRequestDto) {
        return memberService.updateMember(memberRequestDto);
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
        MemberDto memberDto = memberMapper.toMemberDto(memberRequestDto);
        return authService.login(memberDto);
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
