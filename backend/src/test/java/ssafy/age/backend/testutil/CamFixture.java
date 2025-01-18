package ssafy.age.backend.testutil;

import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.persistence.CamStatus;
import ssafy.age.backend.member.persistence.Member;

public class CamFixture {

    public static Cam camOne(Member owner) {
        return new Cam("cam1", "192.168.0.1", "seoul", CamStatus.REGISTERED, owner, "https://placehold.co/600x400.png");
    }

    public static Cam camTwo(Member owner) {
        return new Cam("cam2", "192.168.0.2", "seoul", CamStatus.REGISTERED, owner, "https://placehold.co/600x400.png");
    }

    public static Cam camTree(Member owner) {
        return new Cam("cam3", "192.168.0.3", "seoul", CamStatus.REGISTERED, owner, "https://placehold.co/600x400.png");
    }
}
