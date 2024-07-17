package ssafy.age.backend.member.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.age.backend.member.persistence.*;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService implements UserDetailsService {

    private final MemberRepository memberRepository;
    private final MemberMapper mapper = MemberMapper.INSTANCE;

    public MemberDto findByEmail(String email) {
        return mapper.toMemberDto(memberRepository.findByEmail(email));
    }

    public MemberDto updateMember(MemberDto memberDto) {
        try {
            Member member = mapper.toMember(memberDto);
            Member foundMember = memberRepository.findByEmail(member.getEmail());
            foundMember.updateMember(member.getPassword(), member.getPhoneNumber());
            memberRepository.save(foundMember);
            return mapper.toMemberDto(foundMember);
        } catch(Exception e) {
            throw new RuntimeException("회원 정보 변경 시 오류 발생");
        }
    }

    public void deleteMember(MemberDto memberDto) {
        try {
            Member member = mapper.toMember(memberDto);
            memberRepository.delete(memberRepository.findByEmail(member.getEmail()));
        } catch(Exception e) {
            throw new RuntimeException("회원 삭제 시 오류 발생");
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
            throw new RuntimeException("회원 찾지 못함");
        }
    }
}
