package ssafy.age.backend.member.web;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MemberRequestDto {

    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String phoneNumber;

    public MemberRequestDto(String email, String password, String phoneNumber) {
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
    }
}
