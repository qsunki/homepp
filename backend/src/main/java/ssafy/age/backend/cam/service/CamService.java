package ssafy.age.backend.cam.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ssafy.age.backend.cam.exception.CamNotFoundException;
import ssafy.age.backend.cam.exception.JsonParsingException;
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
import ssafy.age.backend.mqtt.MqttService;
import ssafy.age.backend.notification.service.FCMService;
import ssafy.age.backend.security.service.AuthService;

@Service
@Slf4j
@RequiredArgsConstructor
public class CamService {

    private static final String URL_PREFIX = "/api/v1/cams/";
    private static final String THUMBNAIL_SUFFIX = "/thumbnail";

    private final CamRepository camRepository;
    private final CamMapper camMapper = CamMapper.INSTANCE;
    private final MemberRepository memberRepository;
    private final MqttService mqttService;
    private final FCMService fcmService;
    private final AuthService authService;
    private final FileStorage fileStorage;

    @Value("${openAPI.secret}")
    private String key;

    @Value("${file.dir}")
    private String fileDir;

    public List<CamResponseDto> getCams(Long memberId) {
        List<Cam> cams = camRepository.findCamsByMemberId(memberId);
        return cams.stream().map(camMapper::toCamResponseDto).toList();
    }

    public List<CamResponseDto> getCamsBySharedEmail(Long sharedMemberId) {
        List<Cam> cams = camRepository.findCamsBySharedMemberId(sharedMemberId);
        return cams.stream().map(camMapper::toCamResponseDto).toList();
    }

    public CamResponseDto updateCamName(Long camId, Long memberId, String name) {
        verifyMemberByCamId(camId, memberId);
        Cam cam = camRepository.findById(camId).orElseThrow(CamNotFoundException::new);
        cam.updateCamName(name);

        return camMapper.toCamResponseDto(camRepository.save(cam));
    }

    public void deleteCam(Long camId, Long memberId) {
        verifyMemberByCamId(camId, memberId);
        camRepository.deleteById(camId);
    }

    public CamResponseDto registerCam(Long camId, Member member) {
        Cam cam = camRepository.findById(camId).orElseThrow(CamNotFoundException::new);
        cam.registerMember(member);

        return camMapper.toCamResponseDto(camRepository.save(cam));
    }

    public CamResponseDto unregisterCam(Long camId) {
        try {
            Cam cam = camRepository.findById(camId).orElseThrow(CamNotFoundException::new);
            cam.unregisterCam();

            return camMapper.toCamResponseDto(cam);

        } catch (Exception e) {
            throw new CamNotFoundException();
        }
    }

    private String getRegion(String ip) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(getJsonData(ip));

            return jsonNode.get("response")
                    .get("whois")
                    .get("korean")
                    .get("user")
                    .get("netinfo")
                    .get("addr")
                    .asText();
        } catch (Exception e) {
            throw new JsonParsingException();
        }
    }

    private String getJsonData(String ip) {
        log.debug("key: {}", key);
        try {
            URI uri =
                    new URI(
                            "https://apis.data.go.kr/B551505/whois/ip_address?serviceKey="
                                    + key
                                    + "&query="
                                    + ip
                                    + "&answer=json");
            log.debug("uri: {}", uri);
            BufferedReader br =
                    new BufferedReader(
                            new InputStreamReader(
                                    uri.toURL().openStream(), StandardCharsets.UTF_8));
            return br.readLine() + "}";
        } catch (Exception e) {
            throw new JsonParsingException(e);
        }
    }

    @Transactional
    public CamResponseDto createCam(String email, String ip) {
        Member member =
                memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new);
        String region = getRegion(ip);
        Cam cam = camRepository.save(Cam.builder().ip(ip).region(region).member(member).build());
        cam.updateCamName("Cam" + cam.getId());
        fcmService.sendRegisterMessage(email);
        return camMapper.toCamResponseDto(cam);
    }

    public CamResponseDto findCamById(Long camId, Long memberId) {
        verifyMemberByCamId(camId, memberId);
        Cam cam = camRepository.findById(camId).orElseThrow(CamNotFoundException::new);
        return camMapper.toCamResponseDto(cam);
    }

    public StreamResponseDto streamControl(Long camId, String key, String command, Long memberId) {
        if (!camRepository.existsById(camId)) {
            throw new CamNotFoundException();
        }
        verifyMemberByCamId(camId, memberId);
        mqttService.requestStreaming(camId, key, Command.valueOf(command.toUpperCase(Locale.ROOT)));
        return new StreamResponseDto(key, command);
    }

    @Transactional
    public void saveCamThumbnail(Long camId, Long memberId, MultipartFile file) {
        verifyMemberByCamId(camId, memberId);
        Cam cam = camRepository.findById(camId).orElseThrow(CamNotFoundException::new);
        cam.setThumbnailUrl(URL_PREFIX + camId + THUMBNAIL_SUFFIX);
        fileStorage.saveCamThumbnail(camId, file);
    }

    public Resource getCamThumbnail(Long camId) {
        return fileStorage.loadCamThumbnailResource(camId);
    }

    public void controlDetection(Long camId, Long memberId, String command) {
        verifyMemberByCamId(camId, memberId);
        mqttService.requestControl(camId, command);
    }

    public void verifyMemberByCamId(Long camId, Long memberId) {
        Member member = memberRepository.findByCamId(camId).orElseThrow(CamNotFoundException::new);
        if (!member.getId().equals(memberId)) {
            throw new MemberInvalidAccessException();
        }
    }
}
