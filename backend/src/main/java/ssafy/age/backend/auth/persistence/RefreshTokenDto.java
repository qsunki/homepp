package ssafy.age.backend.auth.persistence;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class RefreshTokenDto {

    @NotEmpty
    String refreshToken;
}