package ssafy.age.backend.threat.service;

import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.event.persistence.EventType;
import ssafy.age.backend.event.service.EventMapper;
import ssafy.age.backend.threat.persistence.Threat;
import ssafy.age.backend.threat.web.ThreatResponseDto;

@Mapper(uses = {EventMapper.class})
public interface ThreatMapper {
    ThreatMapper INSTANCE = Mappers.getMapper(ThreatMapper.class);

    @Mapping(source = "video.recordStartedAt", target = "recordStartedAt")
    @Mapping(source = "video.cam.region", target = "region")
    @Mapping(target = "eventTypes", source = "video.events", qualifiedByName = "eventsToEventsTypes")
    @Mapping(source = "id", target = "threatId")
    ThreatResponseDto toThreatResponseDto(Threat threat);

    @Named("eventsToEventsTypes")
    default List<EventType> eventsToEventsTypes(List<Event> events) {
        return events.stream().map(Event::getType).toList();
    }
}
