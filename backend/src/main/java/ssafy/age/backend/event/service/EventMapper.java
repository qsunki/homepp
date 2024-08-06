package ssafy.age.backend.event.service;

import java.util.List;
import java.util.Map;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.event.web.EventResponseDto;
import ssafy.age.backend.video.web.EventDetailDto;

@Mapper
public interface EventMapper {
    EventMapper INSTANCE = Mappers.getMapper(EventMapper.class);

    @Mapping(source = "cam.id", target = "camId")
    @Mapping(source = "cam.name", target = "camName")
    @Mapping(source = "video.id", target = "videoId")
    EventResponseDto toEventResponseDto(Event event);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isRead", ignore = true)
    Event toEvent(EventDto eventDto);

    EventDetailDto eventToEventDetailDto(Event event);

    List<EventDetailDto> map(List<Event> events);
}
