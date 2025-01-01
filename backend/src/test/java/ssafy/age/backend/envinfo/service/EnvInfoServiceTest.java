package ssafy.age.backend.envinfo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
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
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.persistence.CamRepository;
import ssafy.age.backend.cam.persistence.CamStatus;
import ssafy.age.backend.cam.persistence.MemoryCamRepository;
import ssafy.age.backend.cam.service.CamService;
import ssafy.age.backend.envinfo.persistence.EnvInfo;
import ssafy.age.backend.envinfo.persistence.EnvInfoRepository;
import ssafy.age.backend.envinfo.persistence.MemoryEnvInfoRepository;
import ssafy.age.backend.envinfo.persistence.RecordStatus;
import ssafy.age.backend.envinfo.web.EnvInfoReceivedDto;
import ssafy.age.backend.envinfo.web.EnvInfoResponseDto;
import ssafy.age.backend.envinfo.web.RecordStatusDto;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemoryMemberRepository;
import ssafy.age.backend.notification.service.FCMService;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class EnvInfoServiceTest {

    @Mock EnvInfoRepository envInfoRepository;
    @Mock CamRepository camRepository;
    @Mock CamService camService;
    @Mock FCMService fcmService;
    MemoryMemberRepository fakeMemberRepository = new MemoryMemberRepository();
    MemoryCamRepository fakeCamRepository = new MemoryCamRepository();
    MemoryEnvInfoRepository fakeEnvInfoRepository = new MemoryEnvInfoRepository();

    EnvInfoService envInfoService;

    @BeforeEach
    void setUp() {
        envInfoService =
                new EnvInfoService(envInfoRepository, camRepository, camService, fcmService);
        given(envInfoRepository.save(any(EnvInfo.class)))
                .willAnswer(invocation -> fakeEnvInfoRepository.save(invocation.getArgument(0)));
        given(envInfoRepository.findLatestByCamId(anyLong()))
                .willAnswer(
                        invocation ->
                                fakeEnvInfoRepository.findLatestByCamId(invocation.getArgument(0)));
        given(envInfoRepository.findAllByCamId(anyLong()))
                .willAnswer(
                        invocation ->
                                fakeEnvInfoRepository.findAllByCamId(invocation.getArgument(0)));
        given(camRepository.getReferenceById(anyLong()))
                .willAnswer(
                        invocation ->
                                fakeCamRepository.getReferenceById(invocation.getArgument(0)));
    }

    @DisplayName("EnvInfo를 저장할 수 있다.")
    @Test
    void save() {
        // given
        Member member = new Member("test@example.com", "testpassword", "010-0000-0000");
        fakeMemberRepository.save(member);
        Cam cam =
                new Cam(
                        "living room",
                        "192.168.0.1",
                        "seoul",
                        CamStatus.REGISTERED,
                        member,
                        "https://img.example.com/1");
        fakeCamRepository.save(cam);

        LocalDateTime recordedAt = LocalDateTime.of(2024, 1, 1, 0, 0);
        EnvInfoReceivedDto envInfoReceivedDto =
                new EnvInfoReceivedDto(cam.getId(), RecordStatus.OFFLINE, 23.3, 50.0, recordedAt);

        // when
        envInfoService.save(envInfoReceivedDto);

        // then
        List<EnvInfo> envInfos = fakeEnvInfoRepository.findAll();
        assertThat(envInfos).hasSize(1);
        assertThat(envInfos.getFirst().getRecordedAt())
                .isEqualTo(envInfoReceivedDto.getRecordedAt());
        assertThat(envInfos.getFirst().getTemperature())
                .isEqualTo(envInfoReceivedDto.getTemperature());
        assertThat(envInfos.getFirst().getHumidity()).isEqualTo(envInfoReceivedDto.getHumidity());
        assertThat(envInfos.getFirst().getStatus()).isEqualTo(envInfoReceivedDto.getStatus());
        assertThat(envInfos.getFirst().getCam()).isEqualTo(cam);
    }

    @DisplayName("RecordStatus를 변경할 수 있다.")
    @Test
    void updateStatus() {
        // given
        Member member = new Member("test@example.com", "testpassword", "010-0000-0000");
        fakeMemberRepository.save(member);
        Cam cam =
                new Cam(
                        "living room",
                        "192.168.0.1",
                        "seoul",
                        CamStatus.REGISTERED,
                        member,
                        "https://img.example.com/1");
        fakeCamRepository.save(cam);
        EnvInfo envInfo1 =
                new EnvInfo(
                        LocalDateTime.of(2023, 1, 1, 0, 0), 23.3, 50.0, RecordStatus.OFFLINE, cam);
        EnvInfo envInfo2 =
                new EnvInfo(
                        LocalDateTime.of(2024, 1, 1, 0, 0), 23.3, 50.0, RecordStatus.OFFLINE, cam);
        fakeEnvInfoRepository.save(envInfo1);
        fakeEnvInfoRepository.save(envInfo2);

        // when
        envInfoService.updateStatus(new RecordStatusDto(cam.getId(), RecordStatus.RECORDING));

        // then
        assertThat(envInfo2.getStatus()).isEqualTo(RecordStatus.RECORDING);
    }

    @DisplayName("EnvInfo 목록을 가져올 수 있다.")
    @Test
    void getEnvInfos() {
        // given
        Member member = new Member("test@example.com", "testpassword", "010-0000-0000");
        fakeMemberRepository.save(member);
        Cam cam =
                new Cam(
                        "living room",
                        "192.168.0.1",
                        "seoul",
                        CamStatus.REGISTERED,
                        member,
                        "https://img.example.com/1");
        fakeCamRepository.save(cam);
        EnvInfo envInfo1 =
                new EnvInfo(
                        LocalDateTime.of(2023, 1, 1, 0, 0), 23.3, 50.0, RecordStatus.OFFLINE, cam);
        EnvInfo envInfo2 =
                new EnvInfo(
                        LocalDateTime.of(2024, 1, 1, 0, 0), 23.3, 50.0, RecordStatus.OFFLINE, cam);
        fakeEnvInfoRepository.save(envInfo1);
        fakeEnvInfoRepository.save(envInfo2);
        EnvInfoResponseDto envInfoResponseDto1 =
                new EnvInfoResponseDto(
                        envInfo1.getRecordedAt(),
                        envInfo1.getTemperature(),
                        envInfo1.getHumidity(),
                        envInfo1.getStatus());
        EnvInfoResponseDto envInfoResponseDto2 =
                new EnvInfoResponseDto(
                        envInfo2.getRecordedAt(),
                        envInfo2.getTemperature(),
                        envInfo2.getHumidity(),
                        envInfo2.getStatus());

        // when
        List<EnvInfoResponseDto> envInfoResponseDtos = envInfoService.getEnvInfos(cam.getId());

        // then
        assertThat(envInfoResponseDtos)
                .hasSize(2)
                .containsExactlyInAnyOrder(envInfoResponseDto1, envInfoResponseDto2);
    }

    @DisplayName("EnvInfo를 가져올 수 있다.")
    @Test
    void getEnvInfo() {
        // given
        Member member = new Member("test@example.com", "testpassword", "010-0000-0000");
        fakeMemberRepository.save(member);
        Cam cam =
                new Cam(
                        "living room",
                        "192.168.0.1",
                        "seoul",
                        CamStatus.REGISTERED,
                        member,
                        "https://img.example.com/1");
        fakeCamRepository.save(cam);
        EnvInfo envInfo1 =
                new EnvInfo(
                        LocalDateTime.of(2023, 1, 1, 0, 0), 23.3, 50.0, RecordStatus.OFFLINE, cam);
        EnvInfo envInfo2 =
                new EnvInfo(
                        LocalDateTime.of(2024, 1, 1, 0, 0), 23.3, 50.0, RecordStatus.OFFLINE, cam);
        fakeEnvInfoRepository.save(envInfo1);
        fakeEnvInfoRepository.save(envInfo2);
        EnvInfoResponseDto envInfoResponseDto =
                new EnvInfoResponseDto(
                        envInfo2.getRecordedAt(),
                        envInfo2.getTemperature(),
                        envInfo2.getHumidity(),
                        envInfo2.getStatus());

        // when
        EnvInfoResponseDto envInfo = envInfoService.getEnvInfo(cam.getId());

        // then
        assertThat(envInfo).isEqualTo(envInfoResponseDto);
    }
}
