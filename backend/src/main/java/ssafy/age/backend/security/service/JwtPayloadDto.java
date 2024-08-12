package ssafy.age.backend.security.service;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtPayloadDto {
    private Long memberId;
    private String email;
}
