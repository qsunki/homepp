package ssafy.age.backend.event.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.age.backend.event.exception.EventNotFoundException;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.event.persistence.EventRepository;
import ssafy.age.backend.event.web.EventResponseDto;
import ssafy.age.backend.notification.persistence.FCMToken;
import ssafy.age.backend.notification.service.FCMService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final FCMService fcmService;
    private final EventMapper eventMapper = EventMapper.INSTANCE;

    public List<EventResponseDto> getAllEvents() {
        List<Event> eventList = eventRepository.findAll();
        return eventList.stream()
                .map(eventMapper::toEventResponseDto)
                .toList();
    }

    public void handleEvent(EventDto eventDto) {
        eventRepository.save(eventMapper.toEvent(eventDto));
    }

    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    public void readEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(EventNotFoundException::new);
        event.read();
    }

    public void registerThreat(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(EventNotFoundException::new);
        event.registerThreat();
        fcmService.sendMessageToAll(event.getType().toString() + " 알림",
                event.getOccurredAt() + " " + event.getCam().getRegion() + "지역 " + event.getType() + " 발생\n"
                        + "인근 지역 주민들은 주의 바랍니다.");
    }
}
