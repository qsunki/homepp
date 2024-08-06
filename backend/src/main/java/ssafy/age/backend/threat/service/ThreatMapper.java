package ssafy.age.backend.threat.service;

import java.util.List;
import java.util.stream.Collectors;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.threat.persistence.Threat;
import ssafy.age.backend.threat.web.ThreatResponseDto;
import ssafy.age.backend.video.service.VideoMapper;
import ssafy.age.backend.video.web.EventDetailDto;

@Mapper
public interface ThreatMapper {
    ThreatMapper INSTANCE = Mappers.getMapper(ThreatMapper.class);

    @Mapping(source = "video.recordStartAt", target = "recordStartAt")
    @Mapping(source = "video.cam.region", target = "region")
    @Mapping(source = "video.eventList", target = "eventDetails")
    ThreatResponseDto toThreatResponseDto(Threat threat);

    default List<EventDetailDto> mapEventList(List<Event> eventList) {
        return eventList.stream()
                .map(VideoMapper.INSTANCE::toEventDetailDto)
                .collect(Collectors.toList());
    }
}
