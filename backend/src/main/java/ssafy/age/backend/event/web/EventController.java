package ssafy.age.backend.event.web;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.event.service.EventService;
import ssafy.age.backend.security.service.MemberInfoDto;

@Slf4j
@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public List<EventResponseDto> getAllEvents(
            @AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        return eventService.getAllEvents(memberInfoDto.getMemberId());
    }

    @PatchMapping("/{eventId}")
    public void readEvent(@PathVariable Long eventId, @AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        eventService.readEvent(eventId, memberInfoDto.getMemberId());
    }

    @DeleteMapping("/{eventId}")
    public void deleteEvent(@PathVariable Long eventId, @AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        eventService.deleteEvent(eventId, memberInfoDto.getMemberId());
    }

    @GetMapping("/count")
    public Integer countEventsOnToday(@AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        return eventService.countEventsOnToday(memberInfoDto.getMemberId());
    }
}
