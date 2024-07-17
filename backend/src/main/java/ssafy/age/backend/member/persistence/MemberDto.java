package ssafy.age.backend.member.persistence;

import lombok.Data;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Data
public class MemberDto {
    private Long id;
    private String email;
    private String password;
    private Date createdAt;
    private String phoneNumber;
    private List<String> roles;

    public Member toMember(PasswordEncoder passwordEncoder) {
        return Member.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .phoneNumber(phoneNumber)
                .roles(Collections.singletonList("ROLE_USER"))
                .build();
    }
}
