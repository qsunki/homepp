package ssafy.age.backend.envInfo.mqtt;

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

    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleMessage(String message) {
        EnvInfoDto envInfoDto = objectMapper.convertValue(message, EnvInfoDto.class);
        envInfoService.save(envInfoDto);
    }
}
