package ssafy.age.backend.cam.persistence;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberRepository;
import ssafy.age.backend.share.persistence.Share;
import ssafy.age.backend.share.persistence.ShareRepository;

@DataJpaTest
class CamRepositoryTest {

    @Autowired CamRepository camRepository;
    @Autowired MemberRepository memberRepository;
    @Autowired ShareRepository shareRepository;

    @DisplayName("memberId로 공유받은 cam을 찾을 수 있다.")
    @Test
    void findAllBySharedMemberId() {
        // given
        Member sharingMember = new Member("sharing@example.com", "password", "010-0000-0000");
        Member savedSharingMember = memberRepository.save(sharingMember);
        Member sharedMember = new Member("shared@example.com", "password", "010-0000-0001");
        Member savedSharedMember = memberRepository.save(sharedMember);

        Cam cam1 =
                new Cam(
                        "living room",
                        "192.168.0.1",
                        "seoul",
                        CamStatus.REGISTERED,
                        savedSharingMember,
                        "https://example.com/image.jpg");

        Cam cam2 =
                new Cam(
                        "kitchen",
                        "192.168.0.1",
                        "seoul",
                        CamStatus.REGISTERED,
                        savedSharingMember,
                        "https://example.com/image.jpg");
        Cam savedCam1 = camRepository.save(cam1);
        Cam savedCam2 = camRepository.save(cam2);

        Share share = new Share(savedSharingMember, savedSharedMember, "friend");
        shareRepository.save(share);

        // when
        List<Cam> cams = camRepository.findAllBySharedMemberId(savedSharedMember.getId());

        // then
        assertThat(cams).hasSize(2);
        assertThat(cams)
                .extracting(Cam::getId)
                .containsExactlyInAnyOrder(savedCam1.getId(), savedCam2.getId());
    }
}
