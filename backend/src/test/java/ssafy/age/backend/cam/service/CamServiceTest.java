package ssafy.age.backend.cam.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.willAnswer;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import ssafy.age.backend.cam.persistence.*;
import ssafy.age.backend.cam.web.CamResponseDto;
import ssafy.age.backend.file.FileStorage;
import ssafy.age.backend.member.exception.MemberInvalidAccessException;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemoryMemberRepository;
import ssafy.age.backend.mqtt.MqttGateway;
import ssafy.age.backend.notification.service.FCMService;
import ssafy.age.backend.util.IPUtil;

@ExtendWith(MockitoExtension.class)
class CamServiceTest {

    @Mock
    MqttGateway mqttGateway;

    @Mock
    FCMService fcmService;

    @Mock
    FileStorage fileStorage;

    @Mock
    IPUtil ipUtil;

    MemoryCamRepository fakeCamRepository = new MemoryCamRepository();

    @Spy
    MemoryMemberRepository fakeMemberRepository;

    CamService camService;

    @BeforeEach
    void setUp() {
        camService =
                new CamService(fakeCamRepository, fakeMemberRepository, mqttGateway, fcmService, fileStorage, ipUtil);
    }

    @DisplayName("이메일로 등록된 회원을 찾아 캠을 생성한다.")
    @Test
    void creatCam() {
        // given
        Member member = new Member("test@example.com", "testpassword", "010-0000-0000");
        fakeMemberRepository.save(member);

        // when
        CamResponseDto camResponseDto = camService.createCam(member.getEmail(), "0.0.0.0");

        // then
        Cam cam = fakeCamRepository.findAllByMemberId(member.getId()).getFirst();
        assertThat(camResponseDto.camId()).isEqualTo(cam.getId());
        assertThat(camResponseDto.name()).isEqualTo("Cam" + cam.getId());
        assertThat(camResponseDto.thumbnailUrl()).isBlank();
    }

    @DisplayName("해당 member가 가진 캠 목록을 가져올 수 있다.")
    @Test
    void getCams() {
        // given
        Member member = new Member("test@example.com", "testpassword", "010-0000-0000");
        fakeMemberRepository.save(member);
        Cam cam1 = fakeCamRepository.save(new Cam(
                "living room", "192.168.0.1", "seoul", CamStatus.REGISTERED, member, "https://example.com/image.jpg"));
        Cam cam2 = fakeCamRepository.save(new Cam(
                "kitchen", "192.168.0.2", "seoul", CamStatus.REGISTERED, member, "https://example.com/image.jpg"));
        Cam cam3 = fakeCamRepository.save(new Cam(
                "bed room", "192.168.0.3", "seoul", CamStatus.REGISTERED, member, "https://example.com/image.jpg"));

        // when
        List<CamResponseDto> camResponseDtos = camService.getCams(member.getId());

        // then
        assertThat(camResponseDtos).hasSize(3);
        assertThat(camResponseDtos)
                .extracting(CamResponseDto::name)
                .containsExactlyInAnyOrder(cam1.getName(), cam2.getName(), cam3.getName());
    }

    @DisplayName("해당 member 소유가 아닌 캠은 가져오지 않는다.")
    @Test
    void getCams_neg() {
        // given
        Member targetMember = new Member("test@example.com", "testpassword", "010-0000-0000");
        Member anotherMember = new Member("another@example.com", "testpassword", "010-0000-0001");
        fakeMemberRepository.save(targetMember);
        fakeMemberRepository.save(anotherMember);
        Cam cam1 = fakeCamRepository.save(new Cam(
                "living room",
                "192.168.0.1",
                "seoul",
                CamStatus.REGISTERED,
                targetMember,
                "https://example.com/image.jpg"));
        fakeCamRepository.save(new Cam(
                "kitchen",
                "192.168.0.2",
                "seoul",
                CamStatus.REGISTERED,
                anotherMember,
                "https://example.com/image.jpg"));
        fakeCamRepository.save(new Cam(
                "bed room",
                "192.168.0.3",
                "seoul",
                CamStatus.REGISTERED,
                anotherMember,
                "https://example.com/image.jpg"));

        // when
        List<CamResponseDto> camResponseDtos = camService.getCams(targetMember.getId());

        // then
        assertThat(camResponseDtos).hasSize(1);
        assertThat(camResponseDtos).extracting(CamResponseDto::camId).containsExactlyInAnyOrder(cam1.getId());
    }

    @DisplayName("cam의 이름을 수정할 수 있다.")
    @Test
    void updateCam() {
        // given
        Member member = new Member("test@example.com", "testpassword", "010-0000-0000");
        fakeMemberRepository.save(member);
        Cam cam = new Cam(
                "living room", "192.168.0.1", "seoul", CamStatus.REGISTERED, member, "https://example.com/image.jpg");
        fakeCamRepository.save(cam);
        String newCamName = "new room";
        defineFindByCamId();

        // when
        CamResponseDto camResponseDto = camService.updateCamName(cam.getId(), member.getId(), newCamName);

        // then
        assertThat(camResponseDto.camId()).isEqualTo(cam.getId());
        assertThat(camResponseDto.name()).isEqualTo(newCamName);
        assertThat(fakeCamRepository.findById(cam.getId()))
                .get()
                .extracting(Cam::getName)
                .isEqualTo(newCamName);
    }

    @DisplayName("해당 member 소유가 아닌 cam은 수정할 수 없다.")
    @Test
    void updateCam_neg() {
        // given
        Member member = new Member("test@example.com", "testpassword", "010-0000-0000");
        Member anotherMember = new Member("test2@example.com", "testpassword", "010-0000-0001");
        fakeMemberRepository.save(member);
        fakeMemberRepository.save(anotherMember);
        Cam camOfMember = new Cam(
                "living room", "192.168.0.1", "seoul", CamStatus.REGISTERED, member, "https://example.com/image.jpg");
        Cam camOfAnother = new Cam(
                "living room",
                "192.168.0.1",
                "seoul",
                CamStatus.REGISTERED,
                anotherMember,
                "https://example.com/image.jpg");
        fakeCamRepository.save(camOfMember);
        fakeCamRepository.save(camOfAnother);
        String newCamName = "new room";
        defineFindByCamId();

        // when & then
        Long camId = camOfAnother.getId();
        Long memberId = member.getId();
        assertThatThrownBy(() -> camService.updateCamName(camId, memberId, newCamName))
                .isInstanceOf(MemberInvalidAccessException.class);
    }

    private void defineFindByCamId() {
        willAnswer(invocation -> {
                    Cam foundCam = fakeCamRepository
                            .findById(invocation.getArgument(0))
                            .orElseThrow();
                    return fakeMemberRepository.findById(foundCam.getMember().getId());
                })
                .given(fakeMemberRepository)
                .findByCamId(anyLong());
    }
}
