package ssafy.age.backend.envInfo.persistence;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnvInfoRepository extends JpaRepository<EnvInfo, Long> {

    List<EnvInfo> findAllByCamId(Long camId);
}
