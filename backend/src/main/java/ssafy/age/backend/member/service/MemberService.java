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

    public Member findByEmail(String username) {
        return memberRepository.findByEmail(username);
    }

    public Member updateMember(Member member) {
        try {
            Member foundMember = memberRepository.findByEmail(member.getEmail());
            foundMember.updateMember(member.getPassword(), member.getPhoneNumber());
            memberRepository.save(foundMember);
            return foundMember;
        } catch(Exception e) {
            throw new RuntimeException("회원 정보 변경 시 오류 발생");
        }
    }

    public void deleteMember(Member member) {
        try {
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

}
