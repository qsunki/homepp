package ssafy.age.backend.cam.persistence;

import java.util.ArrayList;
import java.util.List;

public class MemoryCamRepository {
    private final List<Cam> cams = new ArrayList<>();

    public void save(Cam cam) {
        cams.add(cam);
    }

    public List<Cam> findCamsByMemberId(Long memberId) {
        return cams.stream().filter(cam -> cam.getMember().getId().equals(memberId)).toList();
    }
}
