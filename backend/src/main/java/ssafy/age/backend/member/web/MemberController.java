package ssafy.age.backend.member.web;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.member.service.MemberService;
import ssafy.age.backend.security.service.AuthService;
import ssafy.age.backend.security.service.MemberInfoDto;

@Slf4j
@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "로그인된 사용자 조회", description = "현재 로그인 된 사용자의 이메일 확인")
    public String getMemberEmail(@AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        return memberInfoDto.getEmail();
    }

    @PostMapping
    @Operation(summary = "회원 가입", description = "신규 회원 가입")
    public MemberResponseDto joinMember(@RequestBody @Valid MemberRequestDto memberRequestDto) {
        return authService.joinMember(
                memberRequestDto.getEmail(),
                memberRequestDto.getPassword(),
                memberRequestDto.getPhoneNumber());
    }

    @PatchMapping
    @Operation(summary = "사용자 정보 수정", description = "현재 로그인 된 사용자 정보 수정")
    public MemberResponseDto updateMember(
            @RequestBody MemberUpdateRequestDto requestDto,
            @AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        return memberService.updateMember(
                requestDto.password(), requestDto.phoneNumber(), memberInfoDto.getMemberId());
    }

    @DeleteMapping("/{email}")
    @Operation(summary = "사용자 정보 삭제", description = "현재 로그인 된 사용자 삭제")
    public void deleteMember(
            @PathVariable String email, @AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        memberService.deleteMember(email, memberInfoDto.getMemberId());
    }

    @GetMapping("/{email}")
    @Operation(summary = "이메일을 통해 사용자 정보 조회", description = "마이페이지 개인정보 조회에서 사용")
    public MemberResponseDto findByEmail(@PathVariable String email) {
        return memberService.findByEmail(email);
    }

    @GetMapping("/emails/{email}")
    @Operation(summary = "사용중인 이메일인지 확인", description = "사용할 수 있으면 true, 없으면 false")
    public boolean checkDuplicatedEmail(@PathVariable String email) {
        return memberService.checkDuplicatedEmail(email);
    }

    @GetMapping("/phone-numbers/{phoneNumber}")
    @Operation(summary = "사용중인 전화번호인지 확인", description = "사용할 수 있으면 true, 없으면 false")
    public boolean checkDuplicatedPhoneNumber(@PathVariable String phoneNumber) {
        return memberService.checkDuplicatedPhoneNumber(phoneNumber);
    }

    @PostMapping("/login")
    @Operation(summary = "로그인", description = "정상적으로 로그인 시 토큰 발급")
    public TokenDto login(@RequestBody @Valid MemberRequestDto memberRequestDto) {
        return authService.login(memberRequestDto.getEmail(), memberRequestDto.getPassword());
    }

    @PostMapping("/reissue")
    @Operation(summary = "access token 재발급", description = "refresh token 유효하면, access token 재발급")
    public TokenDto reissue(@RequestBody @Valid TokenDto tokenDto) {
        return authService.reissue(tokenDto.getRefreshToken());
    }

    @PostMapping("/logout")
    @Operation(summary = "로그아웃", description = "로그인 된 사용자 로그아웃, 토큰 만료시킴")
    public void logout(@RequestBody @Valid TokenDto tokenDto) {
        authService.logout(tokenDto);
    }
}
