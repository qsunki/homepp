package ssafy.age.backend.auth.persistence;

import lombok.*;

@Builder
@Data
public class TokenDto {
    private Long memberId;
    private String grantType;
    private String accessToken;
    private String refreshToken;
    private Long accessTokenExpiresIn;
}
