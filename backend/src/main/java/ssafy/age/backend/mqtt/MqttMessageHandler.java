package ssafy.age.backend.mqtt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.stereotype.Component;
import ssafy.age.backend.envinfo.service.EnvInfoService;
import ssafy.age.backend.envinfo.web.EnvInfoReceivedDto;
import ssafy.age.backend.envinfo.web.RecordStatusDto;
import ssafy.age.backend.event.service.EventDto;
import ssafy.age.backend.event.service.EventService;

@Component
@RequiredArgsConstructor
@Slf4j
public class MqttMessageHandler {

    private final EnvInfoService envInfoService;
    private final EventService eventService;

    @ServiceActivator(inputChannel = "envInfoDto")
    public void handleEnvInfo(EnvInfoReceivedDto envInfoReceivedDto) {
        envInfoService.save(envInfoReceivedDto);
    }

    @ServiceActivator(inputChannel = "eventDto")
    public void handleEvent(EventDto eventDto) {
        eventService.save(eventDto);
    }

    @ServiceActivator(inputChannel = "statusDto")
    public void handleEnvInfoStatus(RecordStatusDto recordStatusDto) {
        envInfoService.updateStatus(recordStatusDto);
    }
}
