package ssafy.age.backend.mqtt;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.springframework.integration.test.mock.MockIntegration.messageArgumentCaptor;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHandler;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
class MqttServiceTest {

    @Autowired MqttService mqttService;
    @Autowired ObjectMapper objectMapper;
    @MockitoBean MqttPahoClientFactory mqttClientFactory;
    @MockitoBean MessageProducer inbound;
    @MockitoBean MessageHandler mqttOutbound;

    @DisplayName("녹화요청 시 MqttRecordRequestDto 메세지를 보낸다.")
    @Test
    void requestRecord() throws JsonProcessingException {
        // given
        ArgumentCaptor<Message<?>> captor = messageArgumentCaptor();
        String randomKey = "random key";
        MqttRecordRequestDto mqttRecordRequestDto =
                new MqttRecordRequestDto(randomKey, Command.START);
        String result = objectMapper.writeValueAsString(mqttRecordRequestDto);

        // when
        mqttService.requestRecord(1L, randomKey, Command.START);

        // then
        verify(mqttOutbound).handleMessage(captor.capture());
        Message<?> message = captor.getValue();
        assertThat(message.getPayload()).isEqualTo(result);
    }

    @DisplayName("streaming 요청 시 MqttControlRequestDto 메세지를 보낸다.")
    @Test
    void requestStreaming() throws JsonProcessingException {
        // given
        ArgumentCaptor<Message<?>> captor = messageArgumentCaptor();
        String randomKey = "random key";
        MqttStreamRequestDto mqttStreamRequestDto =
                new MqttStreamRequestDto(randomKey, Command.START);
        String result = objectMapper.writeValueAsString(mqttStreamRequestDto);

        // when
        mqttService.requestStreaming(1L, randomKey, Command.START);

        // then
        verify(mqttOutbound).handleMessage(captor.capture());
        Message<?> message = captor.getValue();
        assertThat(message.getPayload()).isEqualTo(result);
    }

    @DisplayName("녹화요청 시 MqttRecordRequestDto 메세지를 보낸다.")
    @Test
    void requestControl() throws JsonProcessingException {
        // given
        ArgumentCaptor<Message<?>> captor = messageArgumentCaptor();
        MqttControlRequestDto mqttControlRequestDto = new MqttControlRequestDto(Command.START);
        String result = objectMapper.writeValueAsString(mqttControlRequestDto);

        // when
        mqttService.requestControl(1L, Command.START);

        // then
        verify(mqttOutbound).handleMessage(captor.capture());
        Message<?> message = captor.getValue();
        assertThat(message.getPayload()).isEqualTo(result);
    }
}
