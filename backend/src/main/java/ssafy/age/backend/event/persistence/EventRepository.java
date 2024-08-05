package ssafy.age.backend.event.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    @Query("SELECT e FROM Event e WHERE e.cam.member.email = :email")
    List<Event> findAllEventsByMemberEmail(@Param("email") String email);

    @Query("SELECT COUNT(e) " +
            "FROM Event e " +
            "WHERE e.cam.member.email = :email " +
            "AND e.occurredAt >= :startOfDay " +
            "AND e.occurredAt < :endOfDay")
    Integer countTodayEventsByMemberEmail(
            @Param("email") String email,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );
}
