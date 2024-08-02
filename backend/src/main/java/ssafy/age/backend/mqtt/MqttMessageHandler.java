package ssafy.age.backend.mqtt;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHandler;
import org.springframework.stereotype.Component;
import ssafy.age.backend.envInfo.service.EnvInfoDto;
import ssafy.age.backend.envInfo.service.EnvInfoService;
import ssafy.age.backend.event.service.EventDto;
import ssafy.age.backend.event.service.EventService;

@Component
@RequiredArgsConstructor
@Slf4j
public class MqttMessageHandler implements MessageHandler {

    private final ObjectMapper objectMapper;
    private final EnvInfoService envInfoService;
    private final EventService eventService;

    @Override
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleMessage(Message<?> message) {
        String topic = (String) message.getHeaders().get(MqttHeaders.RECEIVED_TOPIC);
        assert topic != null;
        if (topic.equals("server/envInfo")) {
            try {
                EnvInfoDto envInfoDto =
                        objectMapper.readValue((String) message.getPayload(), EnvInfoDto.class);
                envInfoService.save(envInfoDto);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        } else if (topic.equals("server/event")) {
            try {
                EventDto eventDto =
                        objectMapper.readValue((String) message.getPayload(), EventDto.class);
                eventService.save(eventDto);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
