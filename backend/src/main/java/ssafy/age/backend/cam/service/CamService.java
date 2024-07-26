package ssafy.age.backend.cam.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ssafy.age.backend.cam.exception.CamNotFoundException;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.persistence.CamRepository;
import ssafy.age.backend.cam.web.CamResponseDto;
import ssafy.age.backend.member.persistence.Member;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@Slf4j
public class CamService {

    private final CamRepository camRepository;
    private final CamMapper camMapper = CamMapper.INSTANCE;
    private final String key;

    public CamService(CamRepository camRepository, @Value("${openAPI.secret}") String key) {
        this.camRepository = camRepository;
        this.key = key;
    }

    public List<CamResponseDto> getAllCams() {
        List<Cam> camList = camRepository.findAll();
        return camList.stream()
                .map(camMapper::toCamResponseDto)
                .toList();
    }

    public CamResponseDto updateCamName(Long camId, String name) {
        Cam cam = camRepository.findById(camId)
                .orElseThrow(CamNotFoundException::new);
        cam.updateCamName(name);

        return camMapper.toCamResponseDto(camRepository.save(cam));
    }

    public CamResponseDto registerCam(Long camId, Member member) {
        Cam cam = camRepository.findById(camId)
                .orElseThrow(CamNotFoundException::new);
        cam.registerMember(member);
        setCamRegion(cam);

        return camMapper.toCamResponseDto(camRepository.save(cam));
    }

    public CamResponseDto unregisterCam(Long camId) {
        try {
            Cam cam = camRepository.findById(camId)
                    .orElseThrow(CamNotFoundException::new);
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

            String region = jsonNode.get("response").get("whois")
                    .get("korean").get("PI").get("netinfo").get("addr").asText();

            System.out.println(region);
            cam.setRegion(region);
            camRepository.save(cam);
        } catch (Exception e) {
            throw new RuntimeException();
        }
    }

    private String getJsonData(Cam cam) {
        try {
            URL url = new URL("https://apis.data.go.kr/B551505/whois/ip_address?serviceKey="
                    + key + "&query=" + cam.getIp() + "&answer=json");
            BufferedReader br = new BufferedReader(new InputStreamReader(url.openStream(), StandardCharsets.UTF_8));
            return br.readLine() + "}";
        } catch (Exception e) {
            throw new RuntimeException();
        }
    }

    public CamResponseDto createCam(String ip) {
        Cam cam = camRepository.save(Cam.builder().ip(ip).build());
        return camMapper.toCamResponseDto(cam);
    }
}