package ssafy.age.backend.notification.persistence;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.age.backend.member.persistence.Member;

public interface FCMTokenRepository extends JpaRepository<FCMToken, Long> {
    List<FCMToken> findByMemberEmail(String email);

    Boolean existsByTokenAndMember(String token, Member member);
}
