package ssafy.age.backend.share.persistence;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShareRepository extends JpaRepository<Share, Long> {

    List<Share> findAllByMemberEmail(String email);

    Share findByMemberEmailAndSharedMemberEmail(String email, String sharedMemberEmail);
}
