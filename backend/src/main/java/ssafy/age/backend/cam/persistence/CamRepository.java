package ssafy.age.backend.cam.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
//TODO: 어노테이션 삭제
public interface CamRepository extends JpaRepository<Cam, Long> {

}