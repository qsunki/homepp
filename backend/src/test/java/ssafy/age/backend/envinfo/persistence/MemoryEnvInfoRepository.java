package ssafy.age.backend.envinfo.persistence;

import java.util.*;

public class MemoryEnvInfoRepository {

    private final Map<Long, EnvInfo> envInfos = new HashMap<>();
    private Long sequence = 1L;

    public EnvInfo save(EnvInfo envInfo) {
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

    public List<EnvInfo> findAll() {
        return envInfos.values().stream().toList();
    }

    public Optional<EnvInfo> findLatestByCamId(Long camId) {
        return envInfos.values().stream()
                .filter(envInfo -> envInfo.getCam().getId().equals(camId))
                .max(Comparator.comparing(EnvInfo::getRecordedAt));
    }

    public List<EnvInfo> findAllByCamId(Long camId) {
        return envInfos.values().stream()
                .filter(envInfo -> envInfo.getCam().getId().equals(camId))
                .toList();
    }
}
