package ssafy.age.backend.member.persistence;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
                member.getPhoneNumber());
    }

    public Optional<Member> findByEmail(String email) {
        return members.stream().filter(member -> member.getEmail().equals(email)).findFirst();
    }

    public List<Member> findAll() {
        return members;
    }

    public Optional<Member> findById(Long id) {
        return members.stream().filter(member -> member.getId().equals(id)).findFirst();
    }

    public void delete(Member member) {
        members.remove(member);
    }
}
