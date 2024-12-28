package ssafy.age.backend.member.persistence;

import java.util.ArrayList;
import java.util.List;

public class MemoryMemberRepository {

    private final List<Member> members = new ArrayList<>();

    public boolean existsByEmail(String email) {
        return members.stream().anyMatch(member -> member.getEmail().equals(email));
    }

    public Member save(Member member) {
        members.add(member);
        return new MemberStub(
                (long) members.size(),
                member.getEmail(),
                member.getPassword(),
                member.getCreatedAt(),
                member.getPhoneNumber());
    }

    public Member findByEmail(String email) {
        return members.stream()
                .filter(member -> member.getEmail().equals(email))
                .findFirst()
                .orElse(null);
    }

    public List<Member> findAll() {
        return members;
    }
}
