package ssafy.age.backend.member.web;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import ssafy.age.backend.member.persistence.Member;

import java.util.Collections;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MemberRequestDto {

    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String phoneNumber;

    public Member toMember(PasswordEncoder passwordEncoder) {
        return Member.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .phoneNumber(phoneNumber)
                .roles(Collections.singletonList("ROLE_USER"))
                .build();
    }
}
