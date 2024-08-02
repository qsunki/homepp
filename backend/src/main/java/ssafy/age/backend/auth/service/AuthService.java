package ssafy.age.backend.auth.service;

import java.util.Collections;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.age.backend.auth.exception.TokenNotFoundException;
import ssafy.age.backend.auth.persistence.RefreshToken;
import ssafy.age.backend.auth.persistence.RefreshTokenRepository;
import ssafy.age.backend.member.exception.MemberDuplicateEntityException;
import ssafy.age.backend.member.exception.MemberNotFoundException;
import ssafy.age.backend.member.persistence.*;
import ssafy.age.backend.member.service.MemberMapper;
import ssafy.age.backend.member.web.MemberResponseDto;
import ssafy.age.backend.member.web.TokenDto;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final MemberMapper mapper = MemberMapper.INSTANCE;
    private final RedisTemplate<String, String> redisTemplate;
    private static final String BEARER_TYPE = "Bearer";

    @Transactional
    public MemberResponseDto joinMember(String email, String password, String phoneNumber) {
        if (memberRepository.existsByEmail(email)) {
            throw new MemberDuplicateEntityException();
        }

        Member member =
                Member.builder()
                        .email(email)
                        .password(passwordEncoder.encode(password))
                        .phoneNumber(phoneNumber)
                        .roles(Collections.singletonList("ROLE_USER"))
                        .build();

        return mapper.toMemberResponseDto(memberRepository.save(member));
    }

    @Transactional
    public TokenDto login(String email, String password) {
        // 1. Login ID/PW 를 기반으로 AuthenticationToken 생성
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(email, password);

        // 2. 실제로 검증 (사용자 비밀번호 체크) 이 이루어지는 부분
        //    authenticate 메서드가 실행이 될 때 CustomUserDetailsService 에서 만들었던 loadUserByUsername 메서드가 실행됨
        Authentication authentication =
                authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(MemberNotFoundException::new);

        // 3. 인증 정보를 기반으로 JWT 토큰 생성
        TokenDto token = tokenProvider.generateTokenDto(authentication);

        // 4. Redis에  RefreshToken 저장
        refreshTokenRepository.save(new RefreshToken(token.getRefreshToken(), member.getId()));

        // 5. 토큰 발급
        return TokenDto.builder()
                .grantType(BEARER_TYPE)
                .accessToken(token.getAccessToken())
                .refreshToken(token.getRefreshToken())
                .build();
    }

    @Transactional
    public TokenDto reissue(String token) {
        // 1. Redis에 Refresh Token이 저장되어 있는지 확인
        RefreshToken foundTokenInfo =
                refreshTokenRepository.findById(token).orElseThrow(TokenNotFoundException::new);

        String refreshToken = foundTokenInfo.getRefreshToken();
        tokenProvider.validateToken(refreshToken);

        // 2. Refresh Token으로 부터 인증 정보를 꺼냄
        Authentication authentication = tokenProvider.getAuthentication(refreshToken);

        // 3. 새로운 Access Token 생성
        TokenDto accessToken = tokenProvider.generateTokenDto(authentication);

        // Token 재발급
        return TokenDto.builder()
                .grantType(BEARER_TYPE)
                .accessToken(accessToken.getAccessToken())
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional
    public void logout(TokenDto tokenDto) {
        // 유효성 검증
        tokenProvider.validateToken(tokenDto.getAccessToken());
        // 1. Redis에 Refresh Token이 저장되어 있는지 확인
        Optional<RefreshToken> foundTokenInfo =
                refreshTokenRepository.findById(tokenDto.getRefreshToken());

        if (foundTokenInfo.isEmpty()) {
            throw new TokenNotFoundException();
        } else {
            refreshTokenRepository.deleteById(tokenDto.getRefreshToken());
        }
    }

    public String getMemberEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getPrincipal().toString();
    }
}
