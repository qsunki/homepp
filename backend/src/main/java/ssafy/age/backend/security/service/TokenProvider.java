package ssafy.age.backend.security.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.util.List;
import javax.crypto.SecretKey;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import ssafy.age.backend.member.web.TokenDto;
import ssafy.age.backend.security.exception.InvalidTokenException;

@Slf4j
@Component
public class TokenProvider {

    private static final String BEARER_TYPE = "Bearer";
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 1000 * 60 * 30; // 30분
    private static final long REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7; // 7일

    private final ObjectMapper objectMapper;
    private final SecretKey key;
    private final JwtParser jwtParser;

    public TokenProvider(@Value("${jwt.secret}") String secretKey, ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        jwtParser = Jwts.parser().verifyWith(key).build();
    }

    public TokenDto generateTokenDto(JwtPayloadDto jwtPayloadDto) {

        // Access Token 생성
        long now = System.currentTimeMillis();
        Date accessTokenExp = new Date(now + ACCESS_TOKEN_EXPIRE_TIME);
        String accessToken =
                Jwts.builder()
                        .claim("memberData", jwtPayloadDto)
                        .expiration(accessTokenExp)
                        .signWith(key)
                        .compact();

        // Refresh Token 생성
        Date refreshTokenExp = new Date(now + REFRESH_TOKEN_EXPIRE_TIME);
        String refreshToken =
                Jwts.builder()
                        .claim("memberData", jwtPayloadDto)
                        .expiration(refreshTokenExp)
                        .signWith(key)
                        .compact();

        return TokenDto.builder()
                .grantType(BEARER_TYPE)
                .accessToken(accessToken)
                .accessTokenExpiresIn(accessTokenExp.getTime())
                .refreshToken(refreshToken)
                .build();
    }

    public Authentication getAuthentication(String accessToken) {
        // 토큰 복호화
        Object memberDataClaim =
                jwtParser.parseSignedClaims(accessToken).getPayload().get("memberData");
        JwtPayloadDto memberData = objectMapper.convertValue(memberDataClaim, JwtPayloadDto.class);

        return new UsernamePasswordAuthenticationToken(memberData, "", List.of());
    }

    public boolean validateToken(String token) {
        try {
            jwtParser.parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            throw new InvalidTokenException(e);
        }
    }
}
