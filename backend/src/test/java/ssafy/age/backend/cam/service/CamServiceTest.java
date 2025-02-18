package ssafy.age.backend.cam.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.willAnswer;
import static org.mockito.Mockito.verify;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import ssafy.age.backend.cam.persistence.*;
import ssafy.age.backend.cam.web.CamResponseDto;
import ssafy.age.backend.file.FileStorage;
import ssafy.age.backend.member.exception.MemberInvalidAccessException;
import ssafy.age.backend.member.exception.MemberNotFoundException;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemoryMemberRepository;
import ssafy.age.backend.mqtt.MqttGateway;
import ssafy.age.backend.notification.service.FCMService;
import ssafy.age.backend.testutil.CamFixture;
import ssafy.age.backend.testutil.MemberFixture;
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

    @Spy
    MemoryMemberRepository fakeMemberRepository;

    CamService camService;
    CamMapper camMapper = Mappers.getMapper(CamMapper.class);
    MemoryCamRepository fakeCamRepository = new MemoryCamRepository();

    @BeforeEach
    void setUp() {
        camService = new CamService(
                camMapper, fakeCamRepository, fakeMemberRepository, mqttGateway, fcmService, fileStorage, ipUtil);
    }

    @DisplayName("이메일로 등록된 회원을 찾아 캠을 생성한다.")
    @Test
    void createCam() {
        // given
        Member member = MemberFixture.memberOne();
        fakeMemberRepository.save(member);

        // when
        CamResponseDto camResponseDto = camService.createCam(member.getEmail(), "0.0.0.0");

        // then
        Cam cam = fakeCamRepository.findById(camResponseDto.camId()).orElseThrow();
        assertThat(camResponseDto).isEqualTo(camMapper.toDto(cam));
    }

    @DisplayName("이메일로 회원을 찾을 수 없으면 MemberNotFoundException을 던진다.")
    @Test
    void createCam_neg() {
        // given
        String emailOfNotMember = "test@test.com";

        // when & then
        assertThatThrownBy(() -> camService.createCam(emailOfNotMember, "0.0.0.0"))
                .isInstanceOf(MemberNotFoundException.class);
    }

    @DisplayName("캠 등록 성공 시 캠 소유자에게 fcm 알림을 보낸다.")
    @Test
    void createCam_notify() {
        // given
        Member member = MemberFixture.memberOne();
        fakeMemberRepository.save(member);

        // when
        camService.createCam(member.getEmail(), "0.0.0.0");

        // then
        verify(fcmService).sendRegisterMessage(member.getEmail());
    }

    @DisplayName("해당 member가 가진 캠 목록을 가져올 수 있다.")
    @Test
    void getCams() {
        // given
        Member member = MemberFixture.memberOne();
        fakeMemberRepository.save(member);
        Cam cam1 = fakeCamRepository.save(CamFixture.camOne(member));
        Cam cam2 = fakeCamRepository.save(CamFixture.camTwo(member));
        Cam cam3 = fakeCamRepository.save(CamFixture.camTree(member));

        // when
        List<CamResponseDto> camResponseDtos = camService.getCams(member.getId());

        // then
        assertThat(camResponseDtos)
                .hasSize(3)
                .containsExactlyInAnyOrder(camMapper.toDto(cam1), camMapper.toDto(cam2), camMapper.toDto(cam3));
    }

    @DisplayName("해당 member 소유가 아닌 캠은 가져오지 않는다.")
    @Test
    void getCams_neg() {
        // given
        Member memberA = MemberFixture.memberOne();
        Member memberB = MemberFixture.memberTwo();
        fakeMemberRepository.save(memberA);
        fakeMemberRepository.save(memberB);
        Cam camOfMemberA = fakeCamRepository.save(CamFixture.camOne(memberA));
        fakeCamRepository.save(CamFixture.camTwo(memberB));
        fakeCamRepository.save(CamFixture.camTree(memberB));

        // when
        List<CamResponseDto> camResponseDtos = camService.getCams(memberA.getId());

        // then
        assertThat(camResponseDtos).hasSize(1).containsExactlyInAnyOrder(camMapper.toDto(camOfMemberA));
    }

    @DisplayName("cam의 이름을 수정할 수 있다.")
    @Test
    void updateCam() {
        // given
        Member member = MemberFixture.memberOne();
        fakeMemberRepository.save(member);
        Cam cam = CamFixture.camOne(member);
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
        Member memberA = MemberFixture.memberOne();
        Member memberB = MemberFixture.memberTwo();
        fakeMemberRepository.save(memberA);
        fakeMemberRepository.save(memberB);
        Cam camOfMemberA = CamFixture.camOne(memberA);
        Cam camOfMemberB = CamFixture.camTwo(memberB);
        fakeCamRepository.save(camOfMemberA);
        fakeCamRepository.save(camOfMemberB);
        String newCamName = "new room";
        defineFindByCamId();

        // when & then
        Long camId = camOfMemberB.getId();
        Long memberId = memberA.getId();
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
