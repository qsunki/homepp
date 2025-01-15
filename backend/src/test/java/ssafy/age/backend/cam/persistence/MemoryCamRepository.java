package ssafy.age.backend.cam.persistence;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.lang.NonNull;
import ssafy.age.backend.NotImplementedException;
import ssafy.age.backend.NotJpaRepository;

public class MemoryCamRepository implements CamRepository, NotJpaRepository<Cam> {
    private final Map<Long, Cam> cams = new HashMap<>();
    private Long sequence = 1L;

    @Override
    @NonNull
    public <S extends Cam> S save(S cam) {
        if (cam.getId() != null) {
            cams.put(cam.getId(), cam);
            return cam;
        }
        while (cams.containsKey(sequence)) {
            sequence++;
        }
        cam.setId(sequence);
        cams.put(sequence, cam);
        return cam;
    }

    @Override
    @NonNull
    public Cam getReferenceById(@NonNull Long camId) {
        return cams.get(camId);
    }

    @Override
    public List<Cam> findAllByMemberId(Long memberId) {
        return cams.values().stream()
                .filter(cam -> cam.getMember().getId().equals(memberId))
                .toList();
    }

    @Override
    public List<Cam> findAllSharedCamsByMemberId(Long memberId) {
        throw new NotImplementedException();
    }
}
