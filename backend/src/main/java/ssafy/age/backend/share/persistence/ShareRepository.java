package ssafy.age.backend.share.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ShareRepository extends JpaRepository<Share, Long> {
    @Query("SELECT s FROM Share s JOIN FETCH s.sharedMember WHERE s.sharedMember.email = :email")
    Share findBySharedMemberEmail(String email);
}
