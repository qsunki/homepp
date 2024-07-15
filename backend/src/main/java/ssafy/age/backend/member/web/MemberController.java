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

    @PostMapping("/join")
    public MemberResponseDto joinMember(@RequestBody MemberRequestDto memberRequestDto) {
        Member member = memberService.joinMember(mapper.toMember(memberRequestDto));
        return mapper.toResponseDto(member);
    }



}
