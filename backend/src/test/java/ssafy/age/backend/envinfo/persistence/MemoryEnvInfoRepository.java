package ssafy.age.backend.envinfo.persistence;

import java.util.*;
import ssafy.age.backend.testutil.MemoryJpaRepository;

public class MemoryEnvInfoRepository extends MemoryJpaRepository<EnvInfo> implements EnvInfoRepository {

    public MemoryEnvInfoRepository() {
        super(EnvInfo::setId, EnvInfo::getId);
    }

    @Override
    public Optional<EnvInfo> findLatestByCamId(Long camId) {
        return store.values().stream()
                .filter(envInfo -> envInfo.getCam().getId().equals(camId))
                .max(Comparator.comparing(EnvInfo::getRecordedAt));
    }

    @Override
    public List<EnvInfo> findAllByCamId(Long camId) {
        return store.values().stream()
                .filter(envInfo -> envInfo.getCam().getId().equals(camId))
                .toList();
    }
}
