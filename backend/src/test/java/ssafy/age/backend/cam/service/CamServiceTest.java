package ssafy.age.backend.cam.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ssafy.age.backend.cam.persistence.*;
import ssafy.age.backend.cam.web.CamResponseDto;
import ssafy.age.backend.file.FileStorage;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberStub;
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
    MemoryMemberRepository fakeMemberRepository = new MemoryMemberRepository();

    CamService camService;

    @BeforeEach
    void setUp() {
        camService =
                new CamService(fakeCamRepository, fakeMemberRepository, mqttGateway, fcmService, fileStorage, ipUtil);
    }

    @DisplayName("memberId로 캠 목록을 가져올 수 있다.")
    @Test
    void getCams() {
        // given
        Long memberId = 1L;
        Member member = new MemberStub(memberId, "test@example.com", "testpassword", "010-0000-0000");

        fakeCamRepository.save(new Cam(
                "living room", "192.168.0.1", "seoul", CamStatus.REGISTERED, member, "https://example.com/image.jpg"));
        fakeCamRepository.save(new Cam(
                "kitchen", "192.168.0.2", "seoul", CamStatus.REGISTERED, member, "https://example.com/image.jpg"));
        fakeCamRepository.save(new Cam(
                "bed room", "192.168.0.3", "seoul", CamStatus.REGISTERED, member, "https://example.com/image.jpg"));

        // when
        List<CamResponseDto> camResponseDtos = camService.getCams(memberId);

        // then
        assertThat(camResponseDtos).hasSize(3);
        assertThat(camResponseDtos).extracting("name").containsExactlyInAnyOrder("living room", "kitchen", "bed room");
    }

    @DisplayName("이메일로 등록된 회원을 찾아 캠을 생성한다.")
    @Test
    void creatCam() {
        // given
        Long memberId = 1L;
        String email = "test@example.com";
        String clientIP = "0.0.0.0";
        Member member = new MemberStub(memberId, email, "testpassword", "010-0000-0000");
        fakeMemberRepository.save(member);

        // when
        CamResponseDto camResponseDto = camService.createCam(email, clientIP);

        // then
        Cam cam = fakeCamRepository.findAllByMemberId(memberId).getFirst();
        assertThat(camResponseDto.camId()).isEqualTo(cam.getId());
        assertThat(camResponseDto.name()).isEqualTo("Cam" + cam.getId());
        assertThat(camResponseDto.thumbnailUrl()).isBlank();
    }
}
