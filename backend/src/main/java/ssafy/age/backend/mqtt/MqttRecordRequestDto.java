package ssafy.age.backend.mqtt;

import lombok.Data;

@Data
public class MqttRecordRequestDto {
    String key;
    Command command;

    public MqttRecordRequestDto(String key, Command command) {
        this.key = key;
        this.command = command;
    }
}
