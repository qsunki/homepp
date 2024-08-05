package ssafy.age.backend.mqtt;

import lombok.Data;

@Data
public class MqttRecordRequestDto {
    String key;
    RecordCommand command;

    public MqttRecordRequestDto(String key, RecordCommand command) {
        this.key = key;
        this.command = command;
    }
}
