package ssafy.age.backend.mqtt;

import org.springframework.integration.annotation.Gateway;
import org.springframework.integration.annotation.GatewayHeader;
import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.handler.annotation.Header;

@MessagingGateway(defaultRequestChannel = "gatewayRequest", defaultPayloadExpression = "args[0]")
public interface MqttGateway {

    void sendToMqtt(String data, @Header(MqttHeaders.TOPIC) String topic);

    @Gateway(
            headers =
                    @GatewayHeader(
                            name = MqttHeaders.TOPIC,
                            expression = "'cams/' + args[1] + '/video'"))
    void sendRecordRequest(MqttRecordRequestDto payload, long camId);

    @Gateway(
            headers =
                    @GatewayHeader(
                            name = MqttHeaders.TOPIC,
                            expression = "'cams/' + args[1] + '/stream'"))
    void sendStreamingRequest(MqttStreamRequestDto payload, long camId);

    @Gateway(
            headers =
                    @GatewayHeader(
                            name = MqttHeaders.TOPIC,
                            expression = "'cams/' + args[1] + '/control'"))
    void sendControlRequest(MqttControlRequestDto payload, long camId);
}
