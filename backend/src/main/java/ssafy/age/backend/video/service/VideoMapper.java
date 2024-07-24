package ssafy.age.backend.video.service;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.video.persistence.Video;
import ssafy.age.backend.video.web.VideoListResponseDto;

@Mapper
public interface VideoMapper {
    VideoMapper INSTANCE = Mappers.getMapper(VideoMapper.class);

    VideoListResponseDto toVideoListResponseDto(Video video);

}
