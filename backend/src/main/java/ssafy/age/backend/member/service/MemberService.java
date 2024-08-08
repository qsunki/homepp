package ssafy.age.backend.member.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.age.backend.auth.service.AuthService;
import ssafy.age.backend.cam.persistence.CamRepository;
import ssafy.age.backend.member.exception.MemberInvalidAccessException;
import ssafy.age.backend.member.exception.MemberNotFoundException;
import ssafy.age.backend.member.persistence.*;
import ssafy.age.backend.member.web.MemberResponseDto;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService implements UserDetailsService {

    private final MemberRepository memberRepository;
    private final AuthService authService;
    private final MemberMapper mapper = MemberMapper.INSTANCE;
    private final CamRepository camRepository;

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

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            return memberRepository.findByEmail(username).orElseThrow(MemberNotFoundException::new);
        } catch (Exception e) {
            throw new MemberNotFoundException();
        }
    }
}
