package ssafy.age.backend.cam.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CamRepository extends JpaRepository<Cam, Long> {

}