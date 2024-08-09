package ssafy.age.backend.cam.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import ssafy.age.backend.mqtt.Command;

@Data
@AllArgsConstructor
public class StreamResponseDto {
    String key;
    Command command;
}
