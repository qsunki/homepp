package ssafy.age.backend.mqtt;

import com.fasterxml.jackson.annotation.JsonValue;

public enum RecordCommand {
    START("start"),
    END("end");

    private final String command;

    RecordCommand(String command) {
        this.command = command;
    }

    @JsonValue
    public String getCommand() {
        return command;
    }
}
