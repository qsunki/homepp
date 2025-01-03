package ssafy.age.backend.member.persistence;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    @Query("SELECT c.member FROM Cam c WHERE c.id = :camId")
    Optional<Member> findByCamId(@Param("camId") Long camId);

    @Query("SELECT v.cam.member FROM Video v WHERE v.id = :videoId")
    Optional<Member> findByVideoId(@Param("videoId") Long videoId);

    @Query("SELECT e.cam.member FROM Event e WHERE e.id = :eventId")
    Optional<Member> findByEventId(@Param("eventId") Long eventId);

    @Query("SELECT s.sharedMember FROM Share s WHERE s.sharingMember = :sharingMember")
    List<Member> findAllSharedMemberBySharingMember(Member sharingMember);
}
