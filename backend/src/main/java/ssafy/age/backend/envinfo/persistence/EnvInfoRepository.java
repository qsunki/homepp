package ssafy.age.backend.envinfo.persistence;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EnvInfoRepository extends JpaRepository<EnvInfo, Long> {

    @Query("SELECT e FROM EnvInfo e WHERE e.cam.id = :camId ORDER BY e.recordedAt ASC")
    List<EnvInfo> findAllByCamId(Long camId);

    @Query("SELECT e FROM EnvInfo e WHERE e.cam.id = :camId ORDER BY e.id DESC LIMIT 1")
    Optional<EnvInfo> findLatestByCamId(Long camId);
}
