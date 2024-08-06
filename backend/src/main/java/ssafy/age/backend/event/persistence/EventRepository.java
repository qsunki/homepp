package ssafy.age.backend.event.persistence;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByOccurredAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT e FROM Event e WHERE e.cam.member.email = :email")
    List<Event> findAllEventsByMemberEmail(@Param("email") String email);

    @Query(
            "SELECT COUNT(e) "
                    + "FROM Event e "
                    + "WHERE e.cam.member.email = :email "
                    + "AND e.occurredAt >= :startOfDay "
                    + "AND e.occurredAt < :endOfDay")
    Integer countTodayEventsByMemberEmail(
            @Param("email") String email,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay);
}
