package ssafy.age.backend.auth.persistence;

import lombok.*;

@Builder
@Data
//TODO: member/controller 이동 + TokenProvider에서 사용하는 것과 controller에서 사용하는 것 분리하기
public class TokenDto {
    private Long memberId;//TODO: 필요한지?
    private String grantType;
    private String accessToken;
    private String refreshToken;
    private Long accessTokenExpiresIn;
}
