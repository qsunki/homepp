package ssafy.age.backend.event.service;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.event.web.EventResponseDto;

@Mapper
public interface EventMapper {
    EventMapper INSTANCE = Mappers.getMapper(EventMapper.class);

    EventResponseDto toEventResponseDto(Event event);

    Event toEvent(EventDto eventDto);
}
