package ssafy.age.backend.event.web;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.event.service.EventMapper;
import ssafy.age.backend.event.service.EventService;

@Slf4j
@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final EventMapper eventMapper = EventMapper.INSTANCE;

    @GetMapping
    public List<EventResponseDto> getAllEvents() {
        return eventService.getAllEvents();
    }

    @PatchMapping("/{eventId}")
    public void readEvent(@PathVariable Long eventId) {
        eventService.readEvent(eventId);
    }

    @PostMapping("/{eventId}/threat")
    public void registerThreat(@PathVariable Long eventId) {
        eventService.registerThreat(eventId);
    }

    @DeleteMapping("/{eventId}")
    public void deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
    }
}
