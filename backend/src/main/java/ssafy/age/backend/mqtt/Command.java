package ssafy.age.backend.mqtt;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Command {
    START("start"),
    END("end");

    private final String name;

    Command(String name) {
        this.name = name;
    }

    @JsonValue
    public String getName() {
        return name;
    }
}
