package ssafy.age.backend.cam.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;

import java.time.LocalDateTime;
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
import ssafy.age.backend.member.persistence.MemberRepository;
import ssafy.age.backend.member.persistence.MemberStub;
import ssafy.age.backend.mqtt.MqttService;
import ssafy.age.backend.notification.service.FCMService;
import ssafy.age.backend.util.IPUtil;

@ExtendWith(MockitoExtension.class)
class CamServiceTest {

    @Mock CamRepository camRepository;
    @Mock MemberRepository memberRepository;
    @Mock MqttService mqttService;
    @Mock FCMService fcmService;
    @Mock FileStorage fileStorage;
    @Mock IPUtil ipUtil;
    MemoryCamRepository fakeCamRepository = new MemoryCamRepository();

    CamService camService;

    @BeforeEach
    void setUp() {
        camService =
                new CamService(
                        camRepository,
                        memberRepository,
                        mqttService,
                        fcmService,
                        fileStorage,
                        ipUtil);
    }

    @DisplayName("memberId로 캠 목록을 가져올 수 있다.")
    @Test
    void getCams() {
        // given
        given(camRepository.findCamsByMemberId(anyLong()))
                .willAnswer(
                        invocation ->
                                fakeCamRepository.findCamsByMemberId(invocation.getArgument(0)));
        Long memberId = 1L;
        Member member =
                new MemberStub(
                        memberId,
                        "test@example.com",
                        "testpassword",
                        LocalDateTime.of(2024, 1, 1, 0, 0),
                        "010-0000-0000");

        fakeCamRepository.save(
                new CamStub(
                        1L,
                        "living room",
                        "192.168.0.1",
                        "seoul",
                        CamStatus.REGISTERED,
                        member,
                        "https://example.com/image.jpg"));
        fakeCamRepository.save(
                new CamStub(
                        2L,
                        "kitchen",
                        "192.168.0.2",
                        "seoul",
                        CamStatus.REGISTERED,
                        member,
                        "https://example.com/image.jpg"));
        fakeCamRepository.save(
                new CamStub(
                        3L,
                        "bed room",
                        "192.168.0.3",
                        "seoul",
                        CamStatus.REGISTERED,
                        member,
                        "https://example.com/image.jpg"));

        // when
        List<CamResponseDto> camResponseDtos = camService.getCams(memberId);

        // then
        assertThat(camResponseDtos).hasSize(3);
        assertThat(camResponseDtos)
                .extracting("name")
                .containsExactlyInAnyOrder("living room", "kitchen", "bed room");
    }
}
