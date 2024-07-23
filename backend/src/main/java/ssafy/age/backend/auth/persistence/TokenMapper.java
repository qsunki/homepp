package ssafy.age.backend.auth.persistence;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
//TODO: 필드 몇개 없다면 직접해주기 @Mapping ignore가 넘 많음
public interface TokenMapper {
    TokenMapper INSTANCE = Mappers.getMapper(TokenMapper.class);

    @Mapping(target = "memberId", ignore = true)
    @Mapping(target = "grantType", ignore = true)
    @Mapping(target = "accessToken", ignore = true)
    @Mapping(target = "accessTokenExpiresIn", ignore = true)
    TokenDto toTokenDto(RefreshTokenDto refreshTokenDto);
}
