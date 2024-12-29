package ssafy.age.backend.envInfo.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.envInfo.persistence.EnvInfo;
import ssafy.age.backend.envInfo.web.EnvInfoReceivedDto;
import ssafy.age.backend.envInfo.web.EnvInfoResponseDto;

@Mapper
public interface EnvInfoMapper {
    EnvInfoMapper INSTANCE = Mappers.getMapper(EnvInfoMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", source = "envInfoReceivedDto.status")
    EnvInfo toEnvInfo(EnvInfoReceivedDto envInfoReceivedDto, Cam cam);

    EnvInfoResponseDto toEnvInfoResponseDto(EnvInfo envInfo);
}
