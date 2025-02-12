package ssafy.age.backend.security.service;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.age.backend.member.exception.MemberDuplicateEntityException;
import ssafy.age.backend.member.exception.MemberNotFoundException;
import ssafy.age.backend.member.persistence.*;
import ssafy.age.backend.member.service.MemberMapper;
import ssafy.age.backend.member.web.MemberResponseDto;
import ssafy.age.backend.member.web.TokenDto;
import ssafy.age.backend.security.exception.TokenNotFoundException;
import ssafy.age.backend.security.persistence.RefreshToken;
import ssafy.age.backend.security.persistence.RefreshTokenRepository;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final MemberMapper mapper = MemberMapper.INSTANCE;
    private static final String BEARER_TYPE = "Bearer";

    @Transactional
    public MemberResponseDto joinMember(String email, String password, String phoneNumber) {
        if (memberRepository.existsByEmail(email)) {
            throw new MemberDuplicateEntityException();
        }

        String encodedPassword = passwordEncoder.encode(password);
        Member member = new Member(email, encodedPassword, phoneNumber);

        return mapper.toMemberResponseDto(memberRepository.save(member));
    }

    @Transactional
    public TokenDto login(String email, String password) {
        // 1. Login ID/PW 를 기반으로 AuthenticationToken 생성
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(email, password);

        // 2. 실제로 검증 (사용자 비밀번호 체크) 이 이루어지는 부분
        //    authenticate 메서드가 실행이 될 때 CustomUserDetailsService 에서 만들었던 loadUserByUsername 메서드가 실행됨
        authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        Member member = memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new);
        MemberInfoDto memberInfoDto = new MemberInfoDto(member.getId(), member.getEmail());

        // 3. 인증 정보를 기반으로 JWT 토큰 생성
        TokenDto token = tokenProvider.generateTokenDto(memberInfoDto);

        // 4. Redis에  RefreshToken 저장
        refreshTokenRepository.save(new RefreshToken(token.refreshToken(), member.getId()));

        // 5. 토큰 발급
        return token;
    }

    @Transactional
    public TokenDto reissue(String token) {
        // 1. Redis에 Refresh Token이 저장되어 있는지 확인
        RefreshToken foundTokenInfo = refreshTokenRepository.findById(token).orElseThrow(TokenNotFoundException::new);

        String refreshToken = foundTokenInfo.getRefreshToken();
        tokenProvider.validateToken(refreshToken);

        // 2. Refresh Token으로 부터 인증 정보를 꺼냄
        Authentication authentication = tokenProvider.getAuthentication(refreshToken);
        MemberInfoDto memberInfoDto = (MemberInfoDto) authentication.getPrincipal();

        // 3. 새로운 Access Token 생성 & Token 재발급
        return tokenProvider.generateTokenDto(memberInfoDto);
    }

    @Transactional
    public void logout(TokenDto tokenDto) {
        // 유효성 검증
        tokenProvider.validateToken(tokenDto.accessToken());
        // 1. Redis에 Refresh Token이 저장되어 있는지 확인
        Optional<RefreshToken> foundTokenInfo = refreshTokenRepository.findById(tokenDto.refreshToken());

        if (foundTokenInfo.isEmpty()) {
            throw new TokenNotFoundException();
        } else {
            refreshTokenRepository.deleteById(tokenDto.refreshToken());
        }
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            Member member = memberRepository.findByEmail(username).orElseThrow(MemberNotFoundException::new);
            return new User(member.getEmail(), member.getPassword(), List.of());
        } catch (Exception e) {
            throw new MemberNotFoundException();
        }
    }
}
