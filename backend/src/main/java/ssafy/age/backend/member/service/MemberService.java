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

    public Member updatePassword(Member member) {
        Member foundMember = memberRepository.findByUsername(member.getUsername());
        foundMember.updatePassword(member.getPassword());
        return foundMember;
    }

    public Member updatePhoneNumber(Member member) {
        Member foundMember = memberRepository.findByUsername(member.getUsername());
        foundMember.updatePassword(member.getPassword());
        return foundMember;
    }

    public void deleteMember(Member member) {
        try {
            memberRepository.delete(memberRepository.findByUsername(member.getUsername()));
        } catch(Exception e) {
            throw new RuntimeException("삭제 시 오류 발생");
        }
    }

}
