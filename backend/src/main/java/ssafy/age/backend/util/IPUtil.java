package ssafy.age.backend.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ssafy.age.backend.cam.exception.JsonParsingException;

@Slf4j
@Component
public class IPUtil {

    private final ObjectMapper objectMapper;
    private final String key;

    public IPUtil(ObjectMapper objectMapper, @Value("${openAPI.secret}") String key) {
        this.objectMapper = objectMapper;
        this.key = key;
    }

    public String getRegion(String ip) {
        try {
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
}
