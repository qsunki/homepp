package ssafy.age.backend.mqtt;

import lombok.Data;

@Data
public class MqttRecordRequestDto {
    Long videoId;
    RecordCommand command;

    public MqttRecordRequestDto(Long videoId, RecordCommand command) {
        this.videoId = videoId;
        this.command = command;
    }
}
