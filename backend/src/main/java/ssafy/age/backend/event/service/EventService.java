package ssafy.age.backend.event.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.event.persistence.EventRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventMapper eventMapper = EventMapper.INSTANCE;

    public List<EventDto> getAllEvents() {
        List<Event> eventList = eventRepository.findAll();
        return eventList.stream()
                .map(eventMapper::toEventDto)
                .toList();
    }

    public EventDto handleEvent(EventDto eventDto) {
        Event event = eventMapper.toEvent(eventDto);
        return eventMapper.toEventDto(eventRepository.save(event));
    }

    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }
}
