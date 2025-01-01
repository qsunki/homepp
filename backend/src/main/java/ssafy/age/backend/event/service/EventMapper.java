package ssafy.age.backend.event.service;

import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.event.web.EventResponseDto;
import ssafy.age.backend.video.web.EventDetailDto;

@Mapper
public interface EventMapper {
    EventMapper INSTANCE = Mappers.getMapper(EventMapper.class);

    @Mapping(target = "eventId", source = "id")
    @Mapping(target = "camId", source = "cam.id")
    @Mapping(target = "camName", source = "cam.name")
    @Mapping(target = "videoId", source = "video.id")
    EventResponseDto toEventResponseDto(Event event);

    EventDetailDto eventToEventDetailDto(Event event);

    List<EventDetailDto> map(List<Event> events);
}
