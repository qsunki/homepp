package ssafy.age.backend.cam.service;

import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
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
@RequiredArgsConstructor
public class CamService {

    private final CamRepository camRepository;
    private final CamMapper camMapper = CamMapper.INSTANCE;
    private final String KEY = "EJYGY6gFWqLO%2BToCg%2BQVJjHFsfobmZqYiD5IcpSHOsILiQPgKprjjZtcQoKngLjbKMTt7gYj04ZG0Xh2LeE1ZQ%3D%3D";

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
        setCamRegion(cam);

        return camMapper.toCamResponseDto(camRepository.save(cam));
    }

    public CamResponseDto registerCam(Long camId, Member member) {
        Cam cam = camRepository.findById(camId)
                .orElseThrow(CamNotFoundException::new);
        cam.registerMember(member);

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

    public void setCamRegion(Cam cam) {
        try{
            URL url = new URL("https://apis.data.go.kr/B551505/whois/ip_address?serviceKey="
                    + KEY + "&query=" + cam.getIp() + "&answer=json");
            BufferedReader br = new BufferedReader(new InputStreamReader(url.openStream(), StandardCharsets.UTF_8));
            String result = br.readLine();

            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject)jsonParser.parse(result + "}");
            System.out.println(jsonObject.toJSONString());
            JSONObject response = (JSONObject)jsonObject.get("response");
            System.out.println(response.toJSONString());
            JSONObject whois = (JSONObject)response.get("whois");
            System.out.println(whois.toJSONString());
            JSONObject korean = (JSONObject)whois.get("korean");
            System.out.println(korean.toJSONString());
            JSONObject pi = (JSONObject)korean.get("PI");
            System.out.println(pi.toJSONString());
            JSONObject netinfo = (JSONObject)pi.get("netinfo");
            System.out.println(netinfo.toJSONString());
            Object addr = netinfo.get("addr");

            cam.setCamRegion(addr.toString());
            camRepository.save(cam);
        } catch(Exception e){
            throw new RuntimeException();
        }
    }
}