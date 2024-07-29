package ssafy.age.backend.video.persistence;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ssafy.age.backend.event.persistence.EventType;

public interface VideoRepository extends JpaRepository<Video, Long> {
    @Query(
            "SELECT DISTINCT v FROM Video v JOIN v.eventList e WHERE e.type IN :types AND e.cam.id"
                + " = :camId AND v.recordStartAt BETWEEN :startDate AND :endDate AND v.isThreat ="
                + " :isThreat")
    List<Video> findAllVideos(
            @Param("types") List<EventType> types,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("camId") Long camId,
            @Param("isThreat") boolean isThreat);
}
