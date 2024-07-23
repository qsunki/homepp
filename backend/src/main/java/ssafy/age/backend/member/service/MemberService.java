package ssafy.age.backend.member.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.age.backend.member.exception.MemberNotFoundException;
import ssafy.age.backend.member.persistence.*;
import ssafy.age.backend.member.web.MemberRequestDto;
import ssafy.age.backend.member.web.MemberResponseDto;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService implements UserDetailsService {

    private final MemberRepository memberRepository;
    private final MemberMapper mapper = MemberMapper.INSTANCE;

    public MemberResponseDto findByEmail(String email) {
        return mapper.toMemberResponseDto(memberRepository.findByEmail(email));
    }

    public MemberResponseDto updateMember(MemberRequestDto memberRequestDto) {
        try {
            Member foundMember = memberRepository.findByEmail(memberRequestDto.getEmail());
            foundMember.updateMember(memberRequestDto.getPassword(), memberRequestDto.getPhoneNumber());
            memberRepository.save(foundMember);
            return mapper.toMemberResponseDto(foundMember);
        } catch(Exception e) {
            throw new MemberNotFoundException();
        }
    }

    public boolean checkDuplicatedEmail(String email) {
        return memberRepository.findByEmail(email) == null;
    }

    public boolean checkDuplicatedPhoneNumber(String phoneNumber) {
        return memberRepository.findByPhoneNumber(phoneNumber) == null;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            return memberRepository.findByEmail(username); 
        } catch(Exception e) {
            throw new MemberNotFoundException();
        }
    }
}
