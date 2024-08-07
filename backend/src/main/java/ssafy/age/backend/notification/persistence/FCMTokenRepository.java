package ssafy.age.backend.notification.persistence;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FCMTokenRepository extends JpaRepository<FCMToken, Long> {
    List<FCMToken> findByMemberEmail(String email);
}
