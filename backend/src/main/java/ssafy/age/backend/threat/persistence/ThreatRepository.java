package ssafy.age.backend.threat.persistence;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThreatRepository extends JpaRepository<Threat, Long> {
    @EntityGraph(attributePaths = {"video", "video.events"})
    List<Threat> findAllByMemberEmail(String email);

    @Override
    @EntityGraph(attributePaths = {"video", "video.events"})
    List<Threat> findAll();
}
