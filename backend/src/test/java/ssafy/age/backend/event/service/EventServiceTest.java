package ssafy.age.backend.event.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import ssafy.age.backend.cam.persistence.MemoryCamRepository;
import ssafy.age.backend.event.persistence.MemoryEventRepository;
import ssafy.age.backend.event.web.EventResponseDto;
import ssafy.age.backend.member.persistence.MemberRepository;
import ssafy.age.backend.notification.service.FCMService;

class EventServiceTest {

    @Mock FCMService fcmService;
    @Mock MemberRepository memberRepository;
    MemoryCamRepository fakeCamRepository;
    MemoryEventRepository fakeEventRepository = new MemoryEventRepository();

    EventService eventService;

    @BeforeEach
    void setUp() {
        eventService =
                new EventService(
                        fakeEventRepository, fcmService, memberRepository, fakeCamRepository);
    }

    @DisplayName("NotForJpaRepository 도입 테스트")
    @Test
    void getAllEvents() {
        // when
        List<EventResponseDto> allEvents = eventService.getAllEvents(1L);

        // then
        assertThat(allEvents).isEmpty();
    }
}
