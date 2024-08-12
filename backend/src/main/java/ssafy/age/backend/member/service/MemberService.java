package ssafy.age.backend.member.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ssafy.age.backend.security.service.AuthService;
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
    private final AuthService authService;
    private final MemberMapper mapper = MemberMapper.INSTANCE;

    public MemberResponseDto findByEmail(String email) {
        return mapper.toMemberResponseDto(
                memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new));
    }

    public MemberResponseDto updateMember(String password, String phoneNumber) {
        try {
            Member foundMember =
                    memberRepository
                            .findByEmail(authService.getMemberEmail())
                            .orElseThrow(MemberNotFoundException::new);
            ;
            foundMember.updateMember(password, phoneNumber);
            memberRepository.save(foundMember);
            return mapper.toMemberResponseDto(foundMember);
        } catch (Exception e) {
            throw new MemberNotFoundException();
        }
    }

    public void deleteMember(String email) {
        try {
            String loggedInEmail = authService.getMemberEmail();
            if (email.equals(loggedInEmail)) {
                memberRepository.delete(
                        memberRepository
                                .findByEmail(email)
                                .orElseThrow(MemberNotFoundException::new));
            } else {
                throw new MemberInvalidAccessException();
            }
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
