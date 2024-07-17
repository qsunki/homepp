package ssafy.age.backend.member.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.auth.persistence.RefreshTokenDto;
import ssafy.age.backend.auth.persistence.TokenMapper;
import ssafy.age.backend.auth.service.AuthService;
import ssafy.age.backend.auth.persistence.TokenDto;
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
    private final TokenMapper tokenMapper = TokenMapper.INSTANCE;

    @GetMapping
    public MemberResponseDto findMember(@RequestBody MemberRequestDto memberRequestDto) {
        MemberDto memberDto = memberService.findByEmail(memberRequestDto.getEmail());
        return memberMapper.toResponseDto(memberDto);
    }

    @PostMapping
    public MemberResponseDto joinMember(@RequestBody @Valid MemberRequestDto memberRequestDto) {
        MemberDto memberDto = authService.joinMember(memberMapper.toMemberDto(memberRequestDto));
        return memberMapper.toResponseDto(memberDto);
    }

    @PatchMapping
    public MemberResponseDto updateMember(@RequestBody MemberRequestDto memberRequestDto) {
        MemberDto memberDto = memberService.updateMember(memberMapper.toMemberDto(memberRequestDto));
        return memberMapper.toResponseDto(memberDto);
    }

    @DeleteMapping
    public void deleteMember(@RequestBody MemberRequestDto memberRequestDto) {
        MemberDto memberDto = memberMapper.toMemberDto(memberRequestDto);
        memberService.deleteMember(memberDto);
    }

    @GetMapping("/{email}")
    public MemberResponseDto findByEmail(@PathVariable String email) {
        MemberDto memberDto = memberService.findByEmail(email);
        return memberMapper.toResponseDto(memberDto);
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
    public TokenDto reissue(@RequestBody @Valid RefreshTokenDto refreshTokenDto) {
        return authService.reissue(tokenMapper.toTokenDto(refreshTokenDto));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody @Valid TokenDto tokenDto) {
        boolean isSuccess = authService.logout(tokenDto);
        if (isSuccess) {
            return ResponseEntity.ok().build();
        }
        else {
            return ResponseEntity.badRequest().build();
        }
    }
}
