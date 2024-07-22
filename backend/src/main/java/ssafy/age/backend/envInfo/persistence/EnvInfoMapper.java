package ssafy.age.backend.envInfo.persistence;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.envInfo.service.EnvInfoDto;

@Mapper
public interface EnvInfoMapper {
    EnvInfoMapper INSTANCE = Mappers.getMapper(EnvInfoMapper.class);

    EnvInfo toEnvInfo(EnvInfoDto envInfoDto);
}
