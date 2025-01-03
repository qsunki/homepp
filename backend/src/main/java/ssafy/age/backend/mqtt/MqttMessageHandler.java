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
import ssafy.age.backend.envinfo.service.EnvInfoService;
import ssafy.age.backend.envinfo.web.EnvInfoReceivedDto;
import ssafy.age.backend.envinfo.web.RecordStatusDto;
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
                EnvInfoReceivedDto envInfoReceivedDto =
                        objectMapper.readValue(
                                (String) message.getPayload(), EnvInfoReceivedDto.class);
                envInfoService.save(envInfoReceivedDto);
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
        } else if (topic.equals("server/status")) {
            try {
                RecordStatusDto recordStatusDto =
                        objectMapper.readValue(
                                (String) message.getPayload(), RecordStatusDto.class);
                envInfoService.updateStatus(recordStatusDto);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
