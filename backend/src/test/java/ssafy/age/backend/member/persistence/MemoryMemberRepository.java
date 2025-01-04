package ssafy.age.backend.member.persistence;

import java.util.*;
import org.springframework.lang.NonNull;
import ssafy.age.backend.NotImplementedException;
import ssafy.age.backend.NotJpaRepository;

@SuppressWarnings({"SpringDataMethodInconsistencyInspection"})
public class MemoryMemberRepository implements MemberRepository, NotJpaRepository<Member, Long> {

    private final Map<Long, Member> members = new HashMap<>();
    private Long sequence = 1L;

    @Override
    @NonNull public <S extends Member> S save(S member) {
        if (member.getId() != null) {
            members.put(member.getId(), member);
            return member;
        }
        while (members.containsKey(sequence)) {
            sequence++;
        }
        member.setId(sequence);
        members.put(sequence, member);
        return member;
    }

    @Override
    public Optional<Member> findByEmail(String email) {
        return members.values().stream()
                .filter(member -> member.getEmail().equals(email))
                .findFirst();
    }

    @Override
    @NonNull public List<Member> findAll() {
        return members.values().stream().toList();
    }

    @Override
    @NonNull public Optional<Member> findById(@NonNull Long id) {
        return Optional.ofNullable(members.get(id));
    }

    @Override
    public void deleteById(@NonNull Long memberId) {
        members.remove(memberId);
    }

    @Override
    public boolean existsByEmail(String email) {
        return members.values().stream().anyMatch(member -> member.getEmail().equals(email));
    }

    @Override
    public boolean existsByPhoneNumber(String phoneNumber) {
        throw new NotImplementedException();
    }

    @Override
    public Optional<Member> findByCamId(Long camId) {
        throw new NotImplementedException();
    }

    @Override
    public Optional<Member> findByVideoId(Long videoId) {
        throw new NotImplementedException();
    }

    @Override
    public Optional<Member> findByEventId(Long eventId) {
        throw new NotImplementedException();
    }

    @Override
    public List<Member> findAllSharedMemberBySharingMember(Member sharingMember) {
        throw new NotImplementedException();
    }
}
