package ssafy.age.backend.threat.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.event.service.EventMapper;
import ssafy.age.backend.threat.persistence.Threat;
import ssafy.age.backend.threat.web.ThreatResponseDto;

@Mapper(uses = {EventMapper.class})
public interface ThreatMapper {
    ThreatMapper INSTANCE = Mappers.getMapper(ThreatMapper.class);

    @Mapping(source = "video.recordStartedAt", target = "recordStartedAt")
    @Mapping(source = "video.cam.region", target = "region")
    @Mapping(source = "video.events", target = "eventDetails")
    @Mapping(source = "id", target = "threatId")
    ThreatResponseDto toThreatResponseDto(Threat threat);
}
