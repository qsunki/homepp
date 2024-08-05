package ssafy.age.backend.event.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.age.backend.auth.service.AuthService;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.event.exception.EventNotFoundException;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.event.persistence.EventRepository;
import ssafy.age.backend.event.web.EventResponseDto;
import ssafy.age.backend.video.persistence.Video;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final AuthService authService;
    private final EventMapper eventMapper = EventMapper.INSTANCE;

    public List<EventResponseDto> getAllEvents() {
        String email = authService.getMemberEmail();
        List<Event> eventList = eventRepository.findAllEventsByMemberEmail(email);
        return eventList.stream().map(eventMapper::toEventResponseDto).toList();
    }

    public void save(EventDto eventDto) {
        Event event = eventMapper.toEvent(eventDto);
        event.setCam(Cam.builder().id(eventDto.getCamId()).build());
        event.setVideo(Video.builder().id(eventDto.getVideoId()).build());
        eventRepository.save(event);
    }

    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    public void readEvent(Long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(EventNotFoundException::new);
        event.read();
    }
}
