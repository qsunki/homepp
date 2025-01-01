package ssafy.age.backend.envinfo.service;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.envinfo.persistence.EnvInfo;
import ssafy.age.backend.envinfo.web.EnvInfoResponseDto;

@Mapper
public interface EnvInfoMapper {
    EnvInfoMapper INSTANCE = Mappers.getMapper(EnvInfoMapper.class);

    EnvInfoResponseDto toEnvInfoResponseDto(EnvInfo envInfo);
}
