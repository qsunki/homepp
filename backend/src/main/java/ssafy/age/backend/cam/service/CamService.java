package ssafy.age.backend.cam.service;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ssafy.age.backend.cam.exception.CamNotFoundException;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.persistence.CamRepository;
import ssafy.age.backend.cam.web.CamResponseDto;
import ssafy.age.backend.cam.web.StreamResponseDto;
import ssafy.age.backend.file.FileStorage;
import ssafy.age.backend.member.exception.MemberInvalidAccessException;
import ssafy.age.backend.member.exception.MemberNotFoundException;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberRepository;
import ssafy.age.backend.mqtt.Command;
import ssafy.age.backend.mqtt.MqttControlRequestDto;
import ssafy.age.backend.mqtt.MqttGateway;
import ssafy.age.backend.mqtt.MqttStreamRequestDto;
import ssafy.age.backend.notification.service.FCMService;
import ssafy.age.backend.util.IPUtil;

@Service
@Slf4j
@RequiredArgsConstructor
public class CamService {

    private static final String URL_PREFIX = "/api/v1/cams/";
    private static final String THUMBNAIL_SUFFIX = "/thumbnail";

    private final CamMapper camMapper;
    private final CamRepository camRepository;
    private final MemberRepository memberRepository;
    private final MqttGateway mqttGateway;
    private final FCMService fcmService;
    private final FileStorage fileStorage;
    private final IPUtil ipUtil;

    @Transactional
    public CamResponseDto createCam(String email, String ip) {
        Member member = memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new);
        String region = ipUtil.getRegion(ip);
        Cam cam = camRepository.save(Cam.create(ip, region, member));
        cam.updateName("Cam" + cam.getId());
        fcmService.sendRegisterMessage(email);
        return camMapper.toDto(cam);
    }

    public List<CamResponseDto> getCams(Long memberId) {
        List<Cam> cams = camRepository.findAllByMemberId(memberId);
        return cams.stream().map(camMapper::toDto).toList();
    }

    public List<CamResponseDto> getCamsBySharedEmail(Long sharedMemberId) {
        List<Cam> cams = camRepository.findAllSharedCamsByMemberId(sharedMemberId);
        return cams.stream().map(camMapper::toDto).toList();
    }

    public CamResponseDto findCamById(Long camId, Long memberId) {
        validateCamOwnership(camId, memberId);
        Cam cam = camRepository.findById(camId).orElseThrow(CamNotFoundException::new);
        return camMapper.toDto(cam);
    }

    public CamResponseDto updateCamName(Long camId, Long memberId, String name) {
        validateCamOwnership(camId, memberId);
        Cam cam = camRepository.findById(camId).orElseThrow(CamNotFoundException::new);
        cam.updateName(name);

        return camMapper.toDto(camRepository.save(cam));
    }

    public void deleteCam(Long camId, Long memberId) {
        validateCamOwnership(camId, memberId);
        camRepository.deleteById(camId);
    }

    @Transactional
    public void saveCamThumbnail(Long camId, MultipartFile file) {
        Cam cam = camRepository.findById(camId).orElseThrow(CamNotFoundException::new);
        cam.updateThumbnailUrl(URL_PREFIX + camId + THUMBNAIL_SUFFIX);
        fileStorage.saveCamThumbnail(camId, file);
    }

    public Resource getCamThumbnail(Long camId) {
        return fileStorage.loadCamThumbnailResource(camId);
    }

    public void detectionControl(Long camId, Long memberId, String command) {
        validateCamOwnership(camId, memberId);
        MqttControlRequestDto mqttControlRequestDto =
                new MqttControlRequestDto(Command.valueOf(command.toUpperCase(Locale.ROOT)));
        mqttGateway.sendControlRequest(mqttControlRequestDto, camId);
    }

    public StreamResponseDto streamingControl(Long camId, String key, String command) {
        if (!camRepository.existsById(camId)) {
            throw new CamNotFoundException();
        }
        MqttStreamRequestDto mqttStreamRequestDto =
                new MqttStreamRequestDto(key, Command.valueOf(command.toUpperCase(Locale.ROOT)));
        mqttGateway.sendStreamingRequest(mqttStreamRequestDto, camId);
        return new StreamResponseDto(key, command);
    }

    public void validateCamOwnership(Long camId, Long memberId) {
        Member member = memberRepository.findByCamId(camId).orElseThrow(CamNotFoundException::new);
        if (!member.getId().equals(memberId)) {
            throw new MemberInvalidAccessException();
        }
    }
}
