package ssafy.age.backend.notification.web;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FCMTokenDto {
    String token;

    public FCMTokenDto(String token) {
        this.token = token;
    }
}
