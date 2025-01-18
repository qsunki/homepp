package ssafy.age.backend.cam.persistence;

import java.util.List;
import ssafy.age.backend.testutils.MemoryJpaRepository;
import ssafy.age.backend.testutils.NotImplementedException;

public class MemoryCamRepository extends MemoryJpaRepository<Cam> implements CamRepository {

    public MemoryCamRepository() {
        super(Cam::setId, Cam::getId);
    }

    @Override
    public List<Cam> findAllByMemberId(Long memberId) {
        return store.values().stream()
                .filter(cam -> cam.getMember().getId().equals(memberId))
                .toList();
    }

    @Override
    public List<Cam> findAllSharedCamsByMemberId(Long memberId) {
        throw new NotImplementedException();
    }
}
