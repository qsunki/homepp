package ssafy.age.backend.member.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ssafy.age.backend.member.persistence.*;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public Member joinMember(Member member) {
        return memberRepository.save(member);
    }

    public List<Member> findAll() {
        return memberRepository.findAll();
    }

    public Member findByUsername(String username) {
        return memberRepository.findByUsername(username);
    }

    public Member updateMember(Member member) {
        try {
            Member foundMember = memberRepository.findByUsername(member.getUsername());
            foundMember.updateMember(foundMember.getPassword(), foundMember.getPhoneNumber());
            return foundMember;
        } catch(Exception e) {
            throw new RuntimeException("회원 정보 변경 시 오류 발생");
        }
    }

    public void deleteMember(Member member) {
        try {
            memberRepository.delete(memberRepository.findByUsername(member.getUsername()));
        } catch(Exception e) {
            throw new RuntimeException("회원 삭제 시 오류 발생");
        }
    }

}
