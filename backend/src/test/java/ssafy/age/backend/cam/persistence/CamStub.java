package ssafy.age.backend.cam.persistence;

import ssafy.age.backend.member.persistence.Member;

public class CamStub extends Cam {

    public CamStub(
            Long id,
            String name,
            String ip,
            String region,
            CamStatus status,
            Member member,
            String thumbnailUrl) {
        super(name, ip, region, status, member, thumbnailUrl);
        setId(id);
    }
}
