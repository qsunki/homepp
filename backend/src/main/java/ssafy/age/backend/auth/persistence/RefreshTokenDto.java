package ssafy.age.backend.auth.persistence;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RefreshTokenDto {

    @NotEmpty
    String refreshToken;
}