package ssafy.age.backend.envinfo.persistence;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
}
