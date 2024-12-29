package ssafy.age.backend.member.persistence;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.persistence.CamRepository;
import ssafy.age.backend.cam.persistence.CamStatus;

@DataJpaTest
class MemberRepositoryTest {
    @Autowired MemberRepository memberRepository;
    @Autowired CamRepository camRepository;

    @DisplayName("camId로 member를 찾을 수 있다.")
    @Test
    void findByCamId() {
        // given
        Member member = new Member("test@example.com", "password", "010-0000-0000");
        Member savedMember = memberRepository.save(member);
        Cam cam =
                new Cam(
                        "living room",
                        "192.168.0.1",
                        "seoul",
                        CamStatus.REGISTERED,
                        savedMember,
                        "https://example.com/image.jpg");
        Cam savedCam = camRepository.save(cam);

        // when
        Member foundMember = memberRepository.findByCamId(savedCam.getId()).orElseThrow();

        // then
        assertThat(savedMember.getId()).isEqualTo(foundMember.getId());
        assertThat(savedMember.getEmail()).isEqualTo(foundMember.getEmail());
        assertThat(savedMember.getPhoneNumber()).isEqualTo(foundMember.getPhoneNumber());
        assertThat(savedMember.getPassword()).isEqualTo(foundMember.getPassword());
    }
}
