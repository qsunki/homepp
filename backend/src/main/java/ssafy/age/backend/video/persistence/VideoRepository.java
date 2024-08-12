package ssafy.age.backend.video.persistence;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ssafy.age.backend.event.persistence.EventType;

public interface VideoRepository extends JpaRepository<Video, Long> {

    @Query(
            "SELECT v FROM Video v LEFT JOIN v.events e LEFT JOIN v.cam c LEFT JOIN c.member m"
                + " WHERE :email = m.email AND(:types IS NULL OR e.type IN :types) AND (:startDate"
                + " IS NULL OR v.recordStartedAt >= :startDate) AND (:endDate IS NULL OR"
                + " v.recordStartedAt <= :endDate) AND (:camId IS NULL OR c.id = :camId) AND"
                + " (:isThreat IS NULL OR v.isThreat = :isThreat)ORDER BY v.id DESC")
    List<Video> findVideosByParams(
            @Param("email") String email,
            @Param("types") List<EventType> types,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("camId") Long camId,
            @Param("isThreat") Boolean isThreat);
}
