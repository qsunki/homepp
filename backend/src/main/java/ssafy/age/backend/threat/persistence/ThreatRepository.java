package ssafy.age.backend.threat.persistence;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThreatRepository extends JpaRepository<Threat, Long> {
    List<Threat> findAllByMemberEmail(String email);
}
