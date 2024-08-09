package ssafy.age.backend.cam.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ssafy.age.backend.auth.service.AuthService;
import ssafy.age.backend.cam.exception.CamNotFoundException;
import ssafy.age.backend.cam.exception.JsonParsingException;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.persistence.CamRepository;
import ssafy.age.backend.cam.web.CamResponseDto;
import ssafy.age.backend.cam.web.StreamResponseDto;
import ssafy.age.backend.file.FileStorage;
import ssafy.age.backend.member.exception.MemberNotFoundException;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberRepository;
import ssafy.age.backend.mqtt.Command;
import ssafy.age.backend.mqtt.MqttService;
import ssafy.age.backend.notification.service.FCMService;

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

    public List<CamResponseDto> getCams() {
        String email = authService.getMemberEmail();
        List<Cam> cams = camRepository.findCamsByMemberEmail(email);
        return cams.stream().map(camMapper::toCamResponseDto).toList();
    }

    public List<CamResponseDto> getCamsBySharedEmail() {
        String sharedEmail = authService.getMemberEmail();
        List<Cam> cams = camRepository.findCamsBySharedMemberEmail(sharedEmail);
        return cams.stream().map(camMapper::toCamResponseDto).toList();
    }

    public CamResponseDto updateCamName(Long camId, String name) {
        Cam cam = camRepository.findById(camId).orElseThrow(CamNotFoundException::new);
        cam.updateCamName(name);

        return camMapper.toCamResponseDto(camRepository.save(cam));
    }

    public void deleteCam(Long camId) {
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

    public CamResponseDto findCamById(Long camId) {
        Cam cam = camRepository.findById(camId).orElseThrow(CamNotFoundException::new);
        return camMapper.toCamResponseDto(cam);
    }

    public StreamResponseDto streamStart(Long camId, Command command) {
        if (!camRepository.existsById(camId)) {
            throw new CamNotFoundException();
        }
        String key = UUID.randomUUID().toString();
        mqttService.requestStreaming(camId, key, command);
        return new StreamResponseDto(key, command);
    }

    @Transactional
    public void saveCamThumbnail(Long camId, MultipartFile file) {
        Cam cam = camRepository.findById(camId).orElseThrow(CamNotFoundException::new);
        cam.setThumbnailUrl(URL_PREFIX + camId + THUMBNAIL_SUFFIX);
        fileStorage.saveCamThumbnail(camId, file);
    }

    public Resource getCamThumbnail(Long camId) {
        return fileStorage.loadCamThumbnailResource(camId);
    }

    public void controlDetection(Long camId, String command) {
        mqttService.requestControl(camId, command);
    }
}
