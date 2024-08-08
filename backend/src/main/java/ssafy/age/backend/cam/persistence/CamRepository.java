package ssafy.age.backend.cam.persistence;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CamRepository extends JpaRepository<Cam, Long> {
    List<Cam> findCamsByMemberEmail(String email);

    @Query(
            "SELECT c FROM Cam c JOIN Share s ON c.member.id = s.member.id WHERE"
                    + " s.sharedMember.email = :sharedEmail")
    List<Cam> findCamsBySharedMemberEmail(String sharedEmail);
}
