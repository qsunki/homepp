package ssafy.age.backend.share.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.share.persistence.Share;
import ssafy.age.backend.share.web.ShareDto;

@Mapper
public interface ShareMapper {
    ShareMapper ISTANCE = Mappers.getMapper(ShareMapper.class);


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "member", ignore = true)

    ShareDto toShareDto(Share share);

}
