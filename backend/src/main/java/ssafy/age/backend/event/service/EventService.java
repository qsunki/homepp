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
import ssafy.age.backend.member.exception.MemberInvalidAccessException;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberRepository;
import ssafy.age.backend.notification.service.FCMService;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final FCMService fcmService;
    private final EventMapper eventMapper = EventMapper.INSTANCE;
    private final MemberRepository memberRepository;

    @Transactional
    public List<EventResponseDto> getAllEvents(Long memberId) {
        List<Event> eventList = eventRepository.findAllEventsByMemberId(memberId);
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

    public void deleteEvent(Long eventId, Long memberId) {
        verifyMemberByEventId(eventId, memberId);
        eventRepository.deleteById(eventId);
    }

    public void readEvent(Long eventId, Long memberId) {
        verifyMemberByEventId(eventId, memberId);
        Event event = eventRepository.findById(eventId).orElseThrow(EventNotFoundException::new);
        event.read();
        eventRepository.save(event);
    }

    public Integer countEventsOnToday(Long memberId) {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);
        return eventRepository.countTodayEventsByMemberId(memberId, startOfDay, endOfDay);
    }

    public void verifyMemberByEventId(Long eventId, Long memberId) {
        Member member = memberRepository.findByEventId(eventId).orElseThrow(EventNotFoundException::new);
        if (!member.getId().equals(memberId)) {
            throw new MemberInvalidAccessException();
        }
    }
}
