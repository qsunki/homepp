package ssafy.age.backend.member.web;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.auth.service.AuthService;
import ssafy.age.backend.auth.persistence.TokenDto;
import ssafy.age.backend.member.persistence.*;
import ssafy.age.backend.member.service.MemberService;

@Slf4j
@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final AuthService authService;
    private final MemberMapper mapper = MemberMapper.INSTANCE;

    @GetMapping
    public MemberResponseDto findMember(@RequestBody MemberRequestDto memberRequestDto) {
        MemberDto memberDto = memberService.findByEmail(memberRequestDto.getEmail());
        return mapper.toResponseDto(memberDto);
    }

    @PostMapping
    public MemberResponseDto joinMember(@RequestBody MemberRequestDto memberRequestDto) {
        MemberDto memberDto = authService.joinMember(mapper.toMemberDto(memberRequestDto));
        return mapper.toResponseDto(memberDto);
    }

    @PatchMapping
    public MemberResponseDto updateMember(@RequestBody MemberRequestDto memberRequestDto) {
        MemberDto memberDto = memberService.updateMember(mapper.toMemberDto(memberRequestDto));
        return mapper.toResponseDto(memberDto);
    }

    @DeleteMapping
    public void deleteMember(@RequestBody MemberRequestDto memberRequestDto) {
        MemberDto memberDto = mapper.toMemberDto(memberRequestDto);
        memberService.deleteMember(memberDto);
    }

    @GetMapping("/{email}")
    public MemberResponseDto findByEmail(@PathVariable String email) {
        MemberDto memberDto = memberService.findByEmail(email);
        return mapper.toResponseDto(memberDto);
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
    public TokenDto login(@RequestBody MemberRequestDto memberRequestDto) {
        MemberDto memberDto = mapper.toMemberDto(memberRequestDto);
        return authService.login(memberDto);
    }
}
