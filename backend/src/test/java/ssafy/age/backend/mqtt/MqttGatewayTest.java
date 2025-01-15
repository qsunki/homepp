package ssafy.age.backend.mqtt;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.springframework.integration.test.mock.MockIntegration.messageArgumentCaptor;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHandler;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
class MqttGatewayTest {

    @MockitoBean
    MqttPahoClientFactory mqttClientFactory;

    @MockitoBean
    MessageProducer inbound;

    @MockitoBean
    MessageHandler mqttOutbound;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    MqttGateway mqttGateway;

    @DisplayName("녹화요청 시 MqttRecordRequestDto 메세지를 보낸다.")
    @Test
    void sendRecordRequest() throws Exception {
        // given
        ArgumentCaptor<Message<?>> captor = messageArgumentCaptor();
        String randomKey = "random key";
        MqttRecordRequestDto mqttRecordRequestDto = new MqttRecordRequestDto(randomKey, Command.START);
        String result = objectMapper.writeValueAsString(mqttRecordRequestDto);

        // when
        mqttGateway.sendRecordRequest(mqttRecordRequestDto, 1);

        // then
        verify(mqttOutbound).handleMessage(captor.capture());
        Message<?> message = captor.getValue();
        assertThat(message.getPayload()).isEqualTo(result);
        assertThat(message.getHeaders().get(MqttHeaders.TOPIC, String.class)).isEqualTo("cams/1/video");
    }

    @DisplayName("streaming 요청 시 MqttControlRequestDto 메세지를 보낸다.")
    @Test
    void requestStreaming() throws Exception {
        // given
        ArgumentCaptor<Message<?>> captor = messageArgumentCaptor();
        String randomKey = "random key";
        MqttStreamRequestDto mqttStreamRequestDto = new MqttStreamRequestDto(randomKey, Command.START);
        String result = objectMapper.writeValueAsString(mqttStreamRequestDto);

        // when
        mqttGateway.sendStreamingRequest(mqttStreamRequestDto, 1L);

        // then
        verify(mqttOutbound).handleMessage(captor.capture());
        Message<?> message = captor.getValue();
        assertThat(message.getPayload()).isEqualTo(result);
        assertThat(message.getHeaders().get(MqttHeaders.TOPIC, String.class)).isEqualTo("cams/1/stream");
    }

    @DisplayName("녹화요청 시 MqttRecordRequestDto 메세지를 보낸다.")
    @Test
    void requestControl() throws Exception {
        // given
        ArgumentCaptor<Message<?>> captor = messageArgumentCaptor();
        MqttControlRequestDto mqttControlRequestDto = new MqttControlRequestDto(Command.START);
        String result = objectMapper.writeValueAsString(mqttControlRequestDto);

        // when
        mqttGateway.sendControlRequest(mqttControlRequestDto, 1L);

        // then
        verify(mqttOutbound).handleMessage(captor.capture());
        Message<?> message = captor.getValue();
        assertThat(message.getPayload()).isEqualTo(result);
        assertThat(message.getHeaders().get(MqttHeaders.TOPIC, String.class)).isEqualTo("cams/1/control");
    }
}
