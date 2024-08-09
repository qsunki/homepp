package ssafy.age.backend.mqtt;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MqttStreamRequestDto {
    String key;
    Command command;
}
