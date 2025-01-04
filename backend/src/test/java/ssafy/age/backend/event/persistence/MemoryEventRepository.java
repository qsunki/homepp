package ssafy.age.backend.event.persistence;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.lang.NonNull;
import ssafy.age.backend.NotJpaRepository;

@SuppressWarnings({"SpringDataMethodInconsistencyInspection"})
public class MemoryEventRepository implements EventRepository, NotJpaRepository<Event> {

    @Override
    public List<Event> findAllByOccurredAtBetween(LocalDateTime start, LocalDateTime end) {
        return List.of();
    }

    @Override
    public List<Event> findAllEventsByMemberId(Long memberId) {
        return List.of();
    }

    @Override
    public Integer countTodayEventsByMemberId(
            Long memberId, LocalDateTime startOfDay, LocalDateTime endOfDay) {
        return 0;
    }

    @Override
    @NonNull public List<Event> findAll() {
        return List.of();
    }
}
