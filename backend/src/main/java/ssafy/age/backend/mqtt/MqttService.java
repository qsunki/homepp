package ssafy.age.backend.mqtt;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MqttService {
    private final MqttGateway mqttGateway;
    private final ObjectMapper objectMapper;

    public void requestRecord(long camId, String key, Command command) {
        MqttRecordRequestDto requestDto = new MqttRecordRequestDto(key, command);
        try {
            String message = objectMapper.writeValueAsString(requestDto);
            mqttGateway.sendToMqtt(message, getRecordRequestTopic(camId));
            log.debug("MQTT send to cam{}, message: {}", camId, message);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public void requestStreaming(long camId, String key, Command command) {
        MqttStreamRequestDto requestDto = new MqttStreamRequestDto(key, command);
        try {
            String message = objectMapper.writeValueAsString(requestDto);
            mqttGateway.sendToMqtt(message, getStreamingRequestTopic(camId));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public void requestControl(long camId, String command) {
        MqttControlRequestDto requestDto = new MqttControlRequestDto(command);
        try {
            String message = objectMapper.writeValueAsString(requestDto);
            mqttGateway.sendToMqtt(message, getControlRequestTopic(camId));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private String getRecordRequestTopic(long camId) {
        return "cams/" + camId + "/video";
    }

    private String getStreamingRequestTopic(long camId) {
        return "cams/" + camId + "/stream";
    }

    private String getControlRequestTopic(long camId) {
        return "cams/" + camId + "/control";
    }
}
