package ssafy.age.backend.video.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.video.persistence.Video;
import ssafy.age.backend.video.web.EventDetailDto;
import ssafy.age.backend.video.web.VideoResponseDto;

@Mapper
public interface VideoMapper {
    VideoMapper INSTANCE = Mappers.getMapper(VideoMapper.class);

    @Mapping(source = "id", target = "videoId")
    @Mapping(target = "eventDetails", ignore = true)
    @Mapping(target = "camName", ignore = true)
    VideoResponseDto toVideoResponseDto(Video video);

    EventDetailDto toEventDetailDto(Event event);
}
