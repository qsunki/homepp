package ssafy.age.backend.member.web;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberMapper;
import ssafy.age.backend.member.persistence.MemberRequestDto;
import ssafy.age.backend.member.persistence.MemberResponseDto;
import ssafy.age.backend.member.service.MemberService;

@Slf4j
@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final MemberMapper mapper = MemberMapper.INSTANCE;

    @GetMapping
    public MemberResponseDto findMember(@RequestBody MemberRequestDto memberRequestDto) {
        Member member = memberService.findByEmail(memberRequestDto.getEmail());
        return mapper.toResponseDto(member);
    }

    @PostMapping
    public MemberResponseDto joinMember(@RequestBody MemberRequestDto memberRequestDto) {
        Member member = memberService.joinMember(mapper.toMember(memberRequestDto));
        return mapper.toResponseDto(member);
    }

    @PatchMapping
    public MemberResponseDto updateMember(@RequestBody MemberRequestDto memberRequestDto) {
        Member member = memberService.updateMember(mapper.toMember(memberRequestDto));
        return mapper.toResponseDto(member);
    }

    @DeleteMapping
    public void deleteMember(@RequestBody MemberRequestDto memberRequestDto) {
        Member member = mapper.toMember(memberRequestDto);
        memberService.deleteMember(member);
    }

    @GetMapping("/{email}")
    public MemberResponseDto findByEmail(@PathVariable String email) {
        Member member = memberService.findByEmail(email);
        return mapper.toResponseDto(member);
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
}
