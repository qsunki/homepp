package ssafy.age.backend.mqtt;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Command {
    START("start"),
    END("end");

    private final String command;

    Command(String command) {
        this.command = command;
    }

    @JsonValue
    public String getCommand() {
        return command;
    }
}
