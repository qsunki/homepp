package ssafy.age.backend.event.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.age.backend.event.exception.EventNotFoundException;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.event.persistence.EventRepository;
import ssafy.age.backend.event.web.EventResponseDto;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
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
    }
}
