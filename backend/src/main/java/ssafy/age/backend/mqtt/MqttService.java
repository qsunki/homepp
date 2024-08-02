package ssafy.age.backend.mqtt;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MqttService {
    private final MqttGateway mqttGateway;
    private final ObjectMapper objectMapper;

    public void requestRecord(long camId, long videoId, RecordCommand command) {
        MqttRecordRequestDto requestDto = new MqttRecordRequestDto(videoId, command);
        try {
            String message = objectMapper.writeValueAsString(requestDto);
            mqttGateway.sendToMqtt(message, getRecordRequestTopic(camId));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public void requestStreaming(long camId, String key) {
        MqttStreamRequestDto requestDto = new MqttStreamRequestDto(key);
        try {
            String message = objectMapper.writeValueAsString(requestDto);
            mqttGateway.sendToMqtt(message, getStreamingRequestTopic(camId));
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
}
