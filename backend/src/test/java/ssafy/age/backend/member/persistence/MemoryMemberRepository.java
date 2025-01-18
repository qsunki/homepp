package ssafy.age.backend.member.persistence;

import java.util.List;
import java.util.Optional;
import ssafy.age.backend.testutil.MemoryJpaRepository;
import ssafy.age.backend.testutil.NotImplementedException;

@SuppressWarnings({"SpringDataMethodInconsistencyInspection"})
public class MemoryMemberRepository extends MemoryJpaRepository<Member> implements MemberRepository {

    public MemoryMemberRepository() {
        super(Member::setId, Member::getId);
    }

    @Override
    public Optional<Member> findByEmail(String email) {
        return store.values().stream()
                .filter(member -> member.getEmail().equals(email))
                .findFirst();
    }

    @Override
    public boolean existsByEmail(String email) {
        return store.values().stream().anyMatch(member -> member.getEmail().equals(email));
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
