package ssafy.age.backend.member.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ssafy.age.backend.member.exception.MemberInvalidAccessException;
import ssafy.age.backend.member.exception.MemberNotFoundException;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberRepository;
import ssafy.age.backend.member.web.MemberResponseDto;
import ssafy.age.backend.security.service.AuthService;

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

    public MemberResponseDto updateMember(String password, String phoneNumber, Long memberId) {
        try {
            Member foundMember =
                    memberRepository
                            .findById(memberId)
                            .orElseThrow(MemberNotFoundException::new);
            ;
            foundMember.updateMember(password, phoneNumber);
            memberRepository.save(foundMember);
            return mapper.toMemberResponseDto(foundMember);
        } catch (Exception e) {
            throw new MemberNotFoundException();
        }
    }

    public void deleteMember(Long memberId) {
        try {
            memberRepository.delete(
                    memberRepository
                            .findById(memberId)
                            .orElseThrow(MemberNotFoundException::new));

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
