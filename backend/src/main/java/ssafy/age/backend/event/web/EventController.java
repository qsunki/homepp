package ssafy.age.backend.event.web;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.event.service.EventDto;
import ssafy.age.backend.event.service.EventMapper;
import ssafy.age.backend.event.service.EventService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final EventMapper eventMapper = EventMapper.INSTANCE;

    @GetMapping
    public List<EventResponseDto> getAllEvents() {
        List<EventDto> eventDtoList = eventService.getAllEvents();
        return eventDtoList.stream()
                .map(eventMapper::toEventResponseDto)
                .toList();
    }

    @DeleteMapping("/{eventId}")
    public void deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
    }


}
