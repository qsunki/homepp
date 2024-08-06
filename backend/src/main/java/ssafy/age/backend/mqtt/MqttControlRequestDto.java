package ssafy.age.backend.mqtt;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MqttControlRequestDto {
    String command;
}
