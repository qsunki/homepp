package ssafy.age.backend.security.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemoryMemberRepository;
import ssafy.age.backend.member.web.MemberResponseDto;
import ssafy.age.backend.security.persistence.RefreshTokenRepository;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    AuthenticationManagerBuilder authenticationManagerBuilder;

    @Mock
    TokenProvider tokenProvider;

    @Mock
    RefreshTokenRepository refreshTokenRepository;

    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    MemoryMemberRepository fakeMemberRepository = new MemoryMemberRepository();

    @DisplayName("이메일, 비밀번호, 전화번호로 회원가입할 수 있다.")
    @Test
    void joinMember() {
        // given
        AuthService authService = new AuthService(
                authenticationManagerBuilder,
                fakeMemberRepository,
                passwordEncoder,
                tokenProvider,
                refreshTokenRepository);
        String email = "test@example.com";
        String password = "1234";
        String phoneNumber = "010-0000-0000";

        // when
        MemberResponseDto memberResponseDto = authService.joinMember(email, password, phoneNumber);

        // then
        assertThat(memberResponseDto.email()).isEqualTo(email);
        assertThat(memberResponseDto.phoneNumber()).isEqualTo(phoneNumber);

        assertThat(fakeMemberRepository.findAll()).hasSize(1);
        assertThat(fakeMemberRepository.existsByEmail(email)).isTrue();

        Member saved = fakeMemberRepository.findByEmail(email).orElseThrow();
        assertThat(saved.getEmail()).isEqualTo(email);
        assertThat(saved.getPhoneNumber()).isEqualTo(phoneNumber);
        assertThat(passwordEncoder.matches(password, saved.getPassword())).isTrue();
    }
}
