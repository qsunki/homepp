package ssafy.age.backend.cam.persistence;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MemoryCamRepository {
    private final Map<Long, Cam> cams = new HashMap<>();
    private Long sequence = 1L;

    public Cam save(Cam cam) {
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

    public List<Cam> findCamsByMemberId(Long memberId) {
        return cams.values().stream()
                .filter(cam -> cam.getMember().getId().equals(memberId))
                .toList();
    }
}
