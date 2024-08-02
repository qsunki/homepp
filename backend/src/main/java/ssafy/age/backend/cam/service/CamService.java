package ssafy.age.backend.cam.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ssafy.age.backend.cam.exception.CamNotFoundException;
import ssafy.age.backend.cam.exception.JsonParsingException;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.persistence.CamRepository;
import ssafy.age.backend.cam.web.CamResponseDto;
import ssafy.age.backend.cam.web.StreamResponseDto;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.mqtt.MqttService;

@Service
@Slf4j
@RequiredArgsConstructor
public class CamService {

    private final CamRepository camRepository;
    private final CamMapper camMapper = CamMapper.INSTANCE;
    private final MqttService mqttService;

    @Value("${openAPI.secret}")
    private String key;

    public List<CamResponseDto> getAllCams() {
        List<Cam> camList = camRepository.findAll();
        return camList.stream().map(camMapper::toCamResponseDto).toList();
    }

    public CamResponseDto updateCamName(Long camId, String name) {
        Cam cam = camRepository.findById(camId).orElseThrow(CamNotFoundException::new);
        cam.updateCamName(name);

        return camMapper.toCamResponseDto(camRepository.save(cam));
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

    private void setCamRegion(Cam cam) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(getJsonData(cam));

            String region =
                    jsonNode.get("response")
                            .get("whois")
                            .get("korean")
                            .get("user")
                            .get("netinfo")
                            .get("addr")
                            .asText();

            cam.setRegion(region);
            camRepository.save(cam);
        } catch (Exception e) {
            throw new JsonParsingException();
        }
    }

    private String getJsonData(Cam cam) {
        try {
            URL url =
                    new URL(
                            "https://apis.data.go.kr/B551505/whois/ip_address?serviceKey="
                                    + key
                                    + "&query="
                                    + cam.getIp()
                                    + "&answer=json");
            BufferedReader br =
                    new BufferedReader(
                            new InputStreamReader(url.openStream(), StandardCharsets.UTF_8));
            return br.readLine() + "}";
        } catch (Exception e) {
            throw new JsonParsingException();
        }
    }

    public CamResponseDto createCam(String ip) {
        Cam cam = camRepository.save(Cam.builder().ip(ip).build());
        setCamRegion(cam);
        return camMapper.toCamResponseDto(cam);
    }

    public CamResponseDto findCamById(Long camId) {
        Cam cam = camRepository.findById(camId).orElseThrow(CamNotFoundException::new);
        return camMapper.toCamResponseDto(cam);
    }

    public StreamResponseDto streamStart(Long camId) {
        if (!camRepository.existsById(camId)) {
            throw new CamNotFoundException();
        }
        String key = UUID.randomUUID().toString();
        mqttService.requestStreaming(camId, key);
        return new StreamResponseDto(key);
    }
}
