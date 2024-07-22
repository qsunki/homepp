package ssafy.age.backend.event.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.event.web.EventResponseDto;

@Mapper
public interface EventMapper {
    EventMapper INSTANCE = Mappers.getMapper(EventMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "occurredAt", ignore = true)

    Event toEvent(EventDto eventDto);

    EventDto toEventDto(Event event);

    EventResponseDto toEventResponseDto(EventDto eventDto);
}
