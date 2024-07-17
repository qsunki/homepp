package ssafy.age.backend.auth.service;

import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.age.backend.auth.persistence.RefreshToken;
import ssafy.age.backend.auth.repository.RefreshTokenRepository;
import ssafy.age.backend.auth.persistence.TokenDto;
import ssafy.age.backend.auth.persistence.TokenProvider;
import ssafy.age.backend.member.persistence.*;
import ssafy.age.backend.member.service.MemberDto;
import ssafy.age.backend.member.service.MemberMapper;

import java.util.concurrent.TimeUnit;

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

    @Transactional
    public MemberDto joinMember(MemberDto memberDto) {
        if (memberRepository.existsByEmail(memberDto.getEmail())) {
            throw new RuntimeException("계정 인증 도중 오류 발생");
        }

        Member member = memberDto.toMember(passwordEncoder);
        return mapper.toMemberDto(memberRepository.save(member));
    }

    @Transactional
    public TokenDto login(MemberDto memberDto) {
        // 1. Login ID/PW 를 기반으로 AuthenticationToken 생성
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(memberDto.getEmail(), memberDto.getPassword());

        // 2. 실제로 검증 (사용자 비밀번호 체크) 이 이루어지는 부분
        //    authenticate 메서드가 실행이 될 때 CustomUserDetailsService 에서 만들었던 loadUserByUsername 메서드가 실행됨
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        Member member = memberRepository.findByEmail(memberDto.getEmail());

        // 3. 인증 정보를 기반으로 JWT 토큰 생성
        TokenDto token = tokenProvider.generateTokenDto(authentication);

        // 4. Redis에  RefreshToken 저장
        refreshTokenRepository.save(
                new RefreshToken(token.getRefreshToken(), member.getId())
        );

        // 5. 토큰 발급
        return TokenDto.builder()
                .accessToken(token.getAccessToken())
                .refreshToken(token.getRefreshToken())
                .memberId(member.getId())
                .build();
    }


    @Transactional
    public TokenDto reissue(TokenDto tokenDto) {
        // 1. Redis에 Refresh Token이 저장되어 있는지 확인
        RefreshToken foundTokenInfo = refreshTokenRepository.findById(tokenDto.getRefreshToken())
                .orElseThrow(() -> new RuntimeException("계정 인증 도중 오류 발생"));

        Member member = memberRepository.findById(foundTokenInfo.getMemberId());

        String refreshToken = foundTokenInfo.getRefreshToken();
        tokenProvider.validateToken(refreshToken);

        // 2. Refresh Token으로 부터 인증 정보를 꺼냄
        Authentication authentication = tokenProvider.getAuthentication(refreshToken);

        // 3. 새로운 Access Token 생성
        TokenDto accessToken = tokenProvider.generateTokenDto(authentication);

        // Token 재발급
        return TokenDto.builder()
                .accessToken(accessToken.getAccessToken())
                .refreshToken(refreshToken)
                .memberId(member.getId())
                .build();
    }

    @Transactional
    public boolean logout(TokenDto tokenDto){
        System.out.println(tokenDto.getAccessToken());
        if (!tokenProvider.validateToken(tokenDto.getAccessToken())) {
            return false;
        }
        // memberId를 찾기 위함
        Authentication authentication = tokenProvider.getAuthentication(tokenDto.getAccessToken());
        //redis에서 해당 id로 저장된 refresh token 확인 후 있으면 삭제
        if (redisTemplate.opsForValue().get("RT:" + authentication.getName()) != null) {
            redisTemplate.delete("RT" + authentication.getName());
        }

        Long expiration = tokenProvider.getExpiration(tokenDto.getAccessToken());
        redisTemplate.opsForValue()
                .set(tokenDto.getAccessToken(), "logout", expiration, TimeUnit.MILLISECONDS);

        return true;
    }
}