package ssafy.age.backend.video.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.event.service.EventMapper;
import ssafy.age.backend.video.persistence.Video;
import ssafy.age.backend.video.web.EventDetailDto;
import ssafy.age.backend.video.web.VideoResponseDto;

@Mapper(uses = {EventMapper.class})
public interface VideoMapper {
    VideoMapper INSTANCE = Mappers.getMapper(VideoMapper.class);

    @Mapping(target = "videoId", source = "id")
    @Mapping(target = "camName", source = "cam.name")
    VideoResponseDto toVideoResponseDto(Video video);

    EventDetailDto toEventDetailDto(Event event);
}
