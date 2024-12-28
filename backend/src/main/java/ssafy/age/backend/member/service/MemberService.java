package ssafy.age.backend.member.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.age.backend.member.exception.MemberNotFoundException;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberRepository;
import ssafy.age.backend.member.web.MemberResponseDto;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private static final MemberMapper mapper = MemberMapper.INSTANCE;

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberResponseDto findByEmail(String email) {
        return mapper.toMemberResponseDto(
                memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new));
    }

    @Transactional
    public MemberResponseDto updateMember(String password, String phoneNumber, Long memberId) {
        Member member =
                memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
        String encodedPassword = passwordEncoder.encode(password);
        member.update(encodedPassword, phoneNumber);
        return mapper.toMemberResponseDto(member);
    }

    @Transactional
    public void deleteMember(Long memberId) {
        memberRepository.delete(
                memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new));
    }

    public boolean checkDuplicatedEmail(String email) {
        return memberRepository.findByEmail(email).isEmpty();
    }

    public boolean checkDuplicatedPhoneNumber(String phoneNumber) {
        return memberRepository.findByPhoneNumber(phoneNumber).isEmpty();
    }
}
