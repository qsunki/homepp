package ssafy.age.backend.member.web;

import lombok.*;

@Builder
@Data
public class TokenDto {
    private String grantType;
    private String accessToken;
    private String refreshToken;
    private Long accessTokenExpiresIn;
}
