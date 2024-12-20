package ssafy.age.backend.cam.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.web.CamResponseDto;

@Mapper
public interface CamMapper {
    CamMapper INSTANCE = Mappers.getMapper(CamMapper.class);

    @Mapping(source = "id", target = "camId")
    CamResponseDto toCamResponseDto(Cam cam);
}
