package ssafy.age.backend.event.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.event.exception.EventNotFoundException;
import ssafy.age.backend.event.persistence.Event;
import ssafy.age.backend.event.persistence.EventRepository;
import ssafy.age.backend.event.web.EventResponseDto;
import ssafy.age.backend.notification.service.FCMService;
import ssafy.age.backend.security.service.AuthService;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final FCMService fcmService;
    private final AuthService authService;
    private final EventMapper eventMapper = EventMapper.INSTANCE;

    @Transactional
    public List<EventResponseDto> getAllEvents() {
        String email = authService.getMemberEmail();
        List<Event> eventList = eventRepository.findAllEventsByMemberEmail(email);
        return eventList.stream().map(eventMapper::toEventResponseDto).toList();
    }

    public void save(EventDto eventDto) {
        Event event =
                Event.builder()
                        .occurredAt(eventDto.getOccurredAt())
                        .type(eventDto.getType())
                        .cam(Cam.builder().id(eventDto.getCamId()).build())
                        .isRead(false)
                        .build();
        Event savedEvent = eventRepository.save(event);
        fcmService.sendEventMessage(savedEvent);
    }

    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    public void readEvent(Long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(EventNotFoundException::new);
        event.read();
        eventRepository.save(event);
    }

    public Integer countEventsOnToday() {
        String email = authService.getMemberEmail();
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);
        return eventRepository.countTodayEventsByMemberEmail(email, startOfDay, endOfDay);
    }
}
