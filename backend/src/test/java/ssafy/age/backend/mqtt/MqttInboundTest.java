package ssafy.age.backend.mqtt;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import ssafy.age.backend.envinfo.persistence.RecordStatus;
import ssafy.age.backend.envinfo.service.EnvInfoService;
import ssafy.age.backend.envinfo.web.EnvInfoReceivedDto;
import ssafy.age.backend.event.persistence.EventType;
import ssafy.age.backend.event.service.EventDto;
import ssafy.age.backend.event.service.EventService;

@SpringBootTest
class MqttInboundTest {

    @Autowired
    MessageChannel mqttInputChannel;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    EnvInfoService envInfoService;

    @MockitoBean
    EventService eventService;

    @MockitoBean
    MqttPahoClientFactory mqttClientFactory;

    @MockitoBean
    MessageProducer inbound;

    @MockitoBean
    MessageHandler mqttOutbound;

    @DisplayName("cam에서 envInfo 정보를 받아서 저장한다.")
    @Test
    void saveEnvInfo() throws Exception {
        // given
        EnvInfoReceivedDto envInfoReceivedDto =
                new EnvInfoReceivedDto(1L, RecordStatus.OFFLINE, 25.0, 30.0, LocalDateTime.of(2025, 1, 1, 0, 0));
        String payload = objectMapper.writeValueAsString(envInfoReceivedDto);

        // when
        mqttInputChannel.send(new GenericMessage<>(payload, Map.of(MqttHeaders.RECEIVED_TOPIC, "server/envInfo")));

        // then
        verify(envInfoService).save(any());
    }

    @DisplayName("cam에서 event 정보를 받아서 저장한다.")
    @Test
    void saveEvent() throws Exception {
        // given
        EventDto eventDto = new EventDto(LocalDateTime.of(2025, 1, 1, 0, 0), EventType.FIRE, 1L);
        String payload = objectMapper.writeValueAsString(eventDto);

        // when
        mqttInputChannel.send(new GenericMessage<>(payload, Map.of(MqttHeaders.RECEIVED_TOPIC, "server/event")));

        // then
        verify(eventService).save(any());
    }

    @DisplayName("cam에서 status 정보를 받아서 업데이트한다.")
    @Test
    void updateStatus() throws Exception {
        // given
        EnvInfoReceivedDto envInfoReceivedDto =
                new EnvInfoReceivedDto(1L, RecordStatus.OFFLINE, 25.0, 30.0, LocalDateTime.of(2025, 1, 1, 0, 0));
        String payload = objectMapper.writeValueAsString(envInfoReceivedDto);

        // when
        mqttInputChannel.send(new GenericMessage<>(payload, Map.of(MqttHeaders.RECEIVED_TOPIC, "server/status")));

        // then
        verify(envInfoService).updateStatus(any());
    }
}
