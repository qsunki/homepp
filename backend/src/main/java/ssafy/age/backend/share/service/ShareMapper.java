package ssafy.age.backend.share.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.share.persistence.Share;
import ssafy.age.backend.share.web.ShareDto;

@Mapper
public interface ShareMapper {
    ShareMapper INSTANCE = Mappers.getMapper(ShareMapper.class);

    @Mapping(source = "sharedMember.email", target = "email")
    ShareDto toShareDto(Share share);
}
