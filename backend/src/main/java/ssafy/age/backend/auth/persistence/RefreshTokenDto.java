package ssafy.age.backend.auth.persistence;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
//TODO: member/controller 이동 or 필드 1개 뿐이라 삭제 후 String 으로 받기
public class RefreshTokenDto {

    @NotEmpty
    String refreshToken;
}