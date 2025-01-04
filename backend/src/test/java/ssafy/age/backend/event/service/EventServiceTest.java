package ssafy.age.backend.event.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ssafy.age.backend.NotImplementedException;
import ssafy.age.backend.cam.persistence.MemoryCamRepository;
import ssafy.age.backend.event.persistence.MemoryEventRepository;
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
        assertThatThrownBy(() -> eventService.getAllEvents(1L))
                .isInstanceOf(NotImplementedException.class);
    }
}
