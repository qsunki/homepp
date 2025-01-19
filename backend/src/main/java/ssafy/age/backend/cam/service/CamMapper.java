package ssafy.age.backend.cam.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.web.CamResponseDto;

@Mapper(componentModel = "spring")
public interface CamMapper {
    @Mapping(source = "id", target = "camId")
    CamResponseDto toDto(Cam cam);
}
