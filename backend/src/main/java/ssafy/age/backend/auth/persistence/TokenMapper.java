package ssafy.age.backend.auth.persistence;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TokenMapper {
    TokenMapper INSTANCE = Mappers.getMapper(TokenMapper.class);

    @Mapping(target = "memberId", ignore = true)
    @Mapping(target = "grantType", ignore = true)
    @Mapping(target = "accessToken", ignore = true)
    @Mapping(target = "accessTokenExpiresIn", ignore = true)
    TokenDto toTokenDto(RefreshTokenDto refreshTokenDto);
}
