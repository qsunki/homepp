package ssafy.age.backend.cam.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.web.CamRequestDto;
import ssafy.age.backend.cam.web.CamResponseDto;

@Mapper
public interface CamMapper {
    CamMapper INSTANCE = Mappers.getMapper(CamMapper.class);

    @Mapping(target = "id", ignore = true)
    CamDto toCamDto(CamRequestDto camRequestDto);

    Cam toCam(CamDto camDto);

    CamDto toCamDto(Cam cam);

    CamResponseDto toCamResponseDto(CamDto camDto);
}
