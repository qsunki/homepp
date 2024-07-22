package ssafy.age.backend.cam.service;

import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.messaging.handler.annotation.Header;

@MessagingGateway(defaultRequestChannel = "mqttOutboundChannel")
public interface CamMqttGateway {
    void sendToMqtt(String data);

    void sendToMqtt(String data, @Header("mqtt_topic") String topic);
}
