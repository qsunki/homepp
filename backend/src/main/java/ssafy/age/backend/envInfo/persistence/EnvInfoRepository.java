package ssafy.age.backend.envInfo.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnvInfoRepository extends JpaRepository<EnvInfo, Long> {

    List<EnvInfo> findByCamId(Long camId);
}
