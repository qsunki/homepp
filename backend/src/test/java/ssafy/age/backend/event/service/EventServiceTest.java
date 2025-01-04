package ssafy.age.backend.event.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ssafy.age.backend.cam.persistence.MemoryCamRepository;
import ssafy.age.backend.event.persistence.MemoryEventRepository;
import ssafy.age.backend.event.web.EventResponseDto;
import ssafy.age.backend.member.persistence.MemoryMemberRepository;
import ssafy.age.backend.notification.service.FCMService;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock FCMService fcmService;
    MemoryMemberRepository fakeMemberRepository;
    MemoryCamRepository fakeCamRepository;
    MemoryEventRepository fakeEventRepository = new MemoryEventRepository();

    EventService eventService;

    @BeforeEach
    void setUp() {
        eventService =
                new EventService(
                        fakeEventRepository, fcmService, fakeMemberRepository, fakeCamRepository);
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
