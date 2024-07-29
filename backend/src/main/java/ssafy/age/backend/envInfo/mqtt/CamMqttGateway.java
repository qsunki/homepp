package ssafy.age.backend.envInfo.mqtt;

import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.handler.annotation.Header;

@MessagingGateway(defaultRequestChannel = "mqttOutboundChannel")
public interface CamMqttGateway {

    void sendToMqtt(String data);

    void sendToMqtt(String data, @Header(MqttHeaders.TOPIC) String topic);
}
