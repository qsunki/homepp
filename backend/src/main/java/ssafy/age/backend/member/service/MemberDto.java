package ssafy.age.backend.member.service;

import lombok.Data;
import org.springframework.security.crypto.password.PasswordEncoder;
import ssafy.age.backend.member.persistence.Member;

import java.sql.Date;
import java.util.Collections;
import java.util.List;

@Data
public class MemberDto {
    private Long id;
    private String email;
    private String password;
    private Date createdAt;//TODO: 타입수정
    private String phoneNumber;
    private List<String> roles;//TODO: 필요?

    public Member toMember(PasswordEncoder passwordEncoder) {
        return Member.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .phoneNumber(phoneNumber)
                .roles(Collections.singletonList("ROLE_USER"))
                .build();
    }
}
