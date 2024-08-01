package ssafy.age.backend.mqtt;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.stereotype.Component;
import ssafy.age.backend.envInfo.service.EnvInfoService;
import ssafy.age.backend.event.service.EventService;

@Component
@RequiredArgsConstructor
@Slf4j
public class MqttMessageHandler {

    private final ObjectMapper objectMapper;
    private final EnvInfoService envInfoService;
    private final EventService eventService;

    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleMessage(String message) {
        // TODO: 토픽 별 메시지 구분
    }
}
