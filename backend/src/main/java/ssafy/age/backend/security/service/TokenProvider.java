package ssafy.age.backend.security.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import ssafy.age.backend.security.exception.InvalidTokenException;
import ssafy.age.backend.member.web.TokenDto;

@Slf4j
@Component
public class TokenProvider {

    private static final String AUTHORITIES_KEY = "auth";
    private static final String BEARER_TYPE = "Bearer";
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 1000 * 60 * 30; // 30분
    private static final long REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7; // 7일

    private final Key key;
    private final JwtParser jwtParser;

    public TokenProvider(@Value("${jwt.secret}") String secretKey) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        jwtParser = Jwts.parserBuilder()
                .setSigningKey(key)
                .build();
    }

    public TokenDto generateTokenDto(JwtPayloadDto jwtPayloadDto) {

        long now = (new Date()).getTime();

        // Access Token 생성
        Date accessTokenExpiresIn = new Date(now + ACCESS_TOKEN_EXPIRE_TIME);
        String accessToken =
                Jwts.builder()
                        .claim("memberData", jwtPayloadDto)
                        .setExpiration(accessTokenExpiresIn) // payload "exp": 1516239022 (예시)
                        .signWith(key, SignatureAlgorithm.HS256) // header "alg": "HS256"
                        .compact();

        // Refresh Token 생성
        String refreshToken =
                Jwts.builder()
                        .claim("memberData", jwtPayloadDto)
                        .setExpiration(new Date(now + REFRESH_TOKEN_EXPIRE_TIME))
                        .signWith(key, SignatureAlgorithm.HS256)
                        .compact();

        return TokenDto.builder()
                .grantType(BEARER_TYPE)
                .accessToken(accessToken)
                .accessTokenExpiresIn(accessTokenExpiresIn.getTime())
                .refreshToken(refreshToken)
                .build();
    }

    public Authentication getAuthentication(String accessToken) {
        // 토큰 복호화
        Claims claims = parseClaims(accessToken);
        JwtPayloadDto memberData = (JwtPayloadDto) claims.get("memberData");

        return new UsernamePasswordAuthenticationToken(memberData, "", List.of());
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            throw new InvalidTokenException(e);
        }
    }

    private Claims parseClaims(String accessToken) {
        try {

            return jwtParser
                    .parseClaimsJws(accessToken)
                    .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }
}
