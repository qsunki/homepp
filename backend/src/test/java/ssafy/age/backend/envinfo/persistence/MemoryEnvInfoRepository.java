package ssafy.age.backend.envinfo.persistence;

import java.util.*;
import org.springframework.lang.NonNull;
import ssafy.age.backend.NotJpaRepository;

public class MemoryEnvInfoRepository implements EnvInfoRepository, NotJpaRepository<EnvInfo> {

    private final Map<Long, EnvInfo> envInfos = new HashMap<>();
    private Long sequence = 1L;

    @Override
    @NonNull public <S extends EnvInfo> S save(S envInfo) {
        if (envInfo.getId() != null) {
            envInfos.put(envInfo.getId(), envInfo);
            return envInfo;
        }
        while (envInfos.containsKey(sequence)) {
            sequence++;
        }
        envInfo.setId(sequence);
        envInfos.put(sequence, envInfo);
        return envInfo;
    }

    @Override
    @NonNull public List<EnvInfo> findAll() {
        return envInfos.values().stream().toList();
    }

    @Override
    public Optional<EnvInfo> findLatestByCamId(Long camId) {
        return envInfos.values().stream()
                .filter(envInfo -> envInfo.getCam().getId().equals(camId))
                .max(Comparator.comparing(EnvInfo::getRecordedAt));
    }

    @Override
    public List<EnvInfo> findAllByCamId(Long camId) {
        return envInfos.values().stream()
                .filter(envInfo -> envInfo.getCam().getId().equals(camId))
                .toList();
    }
}
