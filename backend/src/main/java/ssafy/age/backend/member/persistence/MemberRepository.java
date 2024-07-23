package ssafy.age.backend.member.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository//TODO: 제거
public interface MemberRepository extends JpaRepository<Member, Long> {
    Member findByEmail(String email);
    Member findByPhoneNumber(String phoneNumber);
    boolean existsByEmail(String email);
}
