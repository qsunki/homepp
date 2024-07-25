package ssafy.age.backend.envInfo.persistence;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.envInfo.service.EnvInfoDto;

@Mapper
public interface EnvInfoMapper {
    EnvInfoMapper INSTANCE = Mappers.getMapper(EnvInfoMapper.class);

    @Mapping(source = "camId", target = "id", ignore = true)
    @Mapping(target = "cam", ignore = true)
    EnvInfo toEnvInfo(EnvInfoDto envInfoDto);
}
