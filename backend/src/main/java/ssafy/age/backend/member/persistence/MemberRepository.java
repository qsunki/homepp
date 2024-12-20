package ssafy.age.backend.member.persistence;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);

    Optional<Member> findByPhoneNumber(String phoneNumber);

    boolean existsByEmail(String email);

    @Query("SELECT m FROM Member m JOIN m.camList c WHERE c.id = :camId")
    Optional<Member> findByCamId(@Param("camId") Long camId);

    @Query("SELECT m FROM Member m JOIN m.camList c JOIN c.videoList v WHERE v.id = :videoId")
    Optional<Member> findByVideoId(@Param("videoId") Long videoId);

    @Query(
            "SELECT m FROM Member m JOIN m.camList c JOIN c.videoList v JOIN v.events e WHERE e.id"
                    + " = :eventId")
    Optional<Member> findByEventId(@Param("eventId") Long eventId);
}
