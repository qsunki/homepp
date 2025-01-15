package ssafy.age.backend.member.web;

public record TokenDto(String grantType, String accessToken, String refreshToken, Long accessTokenExpiresIn) {}
