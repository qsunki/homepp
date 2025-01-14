package ssafy.age.backend.mqtt;

import org.springframework.integration.annotation.Gateway;
import org.springframework.integration.annotation.GatewayHeader;
import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.integration.mqtt.support.MqttHeaders;

@MessagingGateway(defaultRequestChannel = "gatewayRequest", defaultPayloadExpression = "args[0]")
public interface MqttGateway {

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
