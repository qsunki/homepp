package ssafy.age.backend.envInfo.mqtt;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.stereotype.Component;
import ssafy.age.backend.envInfo.service.EnvInfoDto;
import ssafy.age.backend.envInfo.service.EnvInfoService;

@Component
@RequiredArgsConstructor
@Slf4j
public class CamMessageHandler {

    private final ObjectMapper objectMapper;
    private final EnvInfoService envInfoService;
    private final EventService eventService;

    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleMessage(String message) {
        try {
            JsonNode jsonNode = objectMapper.readTree(message);
            int camId = jsonNode.get("camId").asInt();
            if (jsonNode.has("envInfo")) {
                EnvInfoDto envInfoDto = objectMapper.convertValue(jsonNode.get("envInfo"), EnvInfoDto.class);
                envInfoService.save(envInfoDto);
            } else if (jsonNode.has("event")) {
                EventDto eventDto = objectMapper.convertValue(jsonNode.get("event"), EventDto.class);
                eventService.handleEvnet(eventDto);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
