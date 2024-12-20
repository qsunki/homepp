package ssafy.age.backend.member.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import ssafy.age.backend.member.exception.MemberInvalidAccessException;
import ssafy.age.backend.member.exception.MemberNotFoundException;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberRepository;
import ssafy.age.backend.member.web.MemberResponseDto;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final MemberMapper mapper = MemberMapper.INSTANCE;

    public MemberResponseDto findByEmail(String email) {
        return mapper.toMemberResponseDto(
                memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new));
    }

    @PreAuthorize("#email == authentication.principal.email")
    public MemberResponseDto updateMember(
            String email, String password, String phoneNumber, Long memberId) {
        try {
            Member foundMember =
                    memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
            ;
            foundMember.updateMember(password, phoneNumber);
            memberRepository.save(foundMember);
            return mapper.toMemberResponseDto(foundMember);
        } catch (Exception e) {
            throw new MemberNotFoundException();
        }
    }

    @PreAuthorize("#email == authentication.principal.email")
    public void deleteMember(String email, Long memberId) {
        try {
            memberRepository.delete(
                    memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new));

        } catch (Exception e) {
            throw new MemberInvalidAccessException(e);
        }
    }

    public boolean checkDuplicatedEmail(String email) {
        return memberRepository.findByEmail(email).isEmpty();
    }

    public boolean checkDuplicatedPhoneNumber(String phoneNumber) {
        return memberRepository.findByPhoneNumber(phoneNumber).isEmpty();
    }
}
