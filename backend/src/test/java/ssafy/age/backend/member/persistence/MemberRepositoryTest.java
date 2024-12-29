package ssafy.age.backend.member.persistence;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.persistence.CamRepository;
import ssafy.age.backend.cam.persistence.CamStatus;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.event.persistence.EventRepository;
import ssafy.age.backend.event.persistence.EventType;
import ssafy.age.backend.video.persistence.Video;
import ssafy.age.backend.video.persistence.VideoRepository;

@DataJpaTest
class MemberRepositoryTest {
    @Autowired MemberRepository memberRepository;
    @Autowired CamRepository camRepository;
    @Autowired VideoRepository videoRepository;
    @Autowired EventRepository eventRepository;

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

    @DisplayName("videoId로 member를 찾을 수 있다.")
    @Test
    void findByVideoId() {
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

        Video video =
                new Video(
                        LocalDateTime.of(2024, 1, 1, 0, 0),
                        100L,
                        "https://stream.example.com",
                        "https://download.example.com",
                        "https://thumbnail.example.com",
                        Boolean.TRUE,
                        savedCam);
        Video savedVideo = videoRepository.save(video);

        // when
        Member foundMember = memberRepository.findByVideoId(savedVideo.getId()).orElseThrow();

        // then
        assertThat(savedMember.getId()).isEqualTo(foundMember.getId());
        assertThat(savedMember.getEmail()).isEqualTo(foundMember.getEmail());
        assertThat(savedMember.getPhoneNumber()).isEqualTo(foundMember.getPhoneNumber());
        assertThat(savedMember.getPassword()).isEqualTo(foundMember.getPassword());
    }

    @DisplayName("eventId로 member를 찾을 수 있다.")
    @Test
    void findByEventId() {
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

        Video video =
                new Video(
                        LocalDateTime.of(2024, 1, 1, 0, 0),
                        100L,
                        "https://stream.example.com",
                        "https://download.example.com",
                        "https://thumbnail.example.com",
                        Boolean.TRUE,
                        savedCam);
        Video savedVideo = videoRepository.save(video);

        Event event =
                new Event(
                        LocalDateTime.of(2024, 1, 2, 0, 0),
                        EventType.FIRE,
                        Boolean.FALSE,
                        savedCam,
                        savedVideo);
        Event savedEvent = eventRepository.save(event);

        // when
        Member foundMember = memberRepository.findByEventId(savedEvent.getId()).orElseThrow();

        // then
        assertThat(savedMember.getId()).isEqualTo(foundMember.getId());
        assertThat(savedMember.getEmail()).isEqualTo(foundMember.getEmail());
        assertThat(savedMember.getPhoneNumber()).isEqualTo(foundMember.getPhoneNumber());
        assertThat(savedMember.getPassword()).isEqualTo(foundMember.getPassword());
    }
}
