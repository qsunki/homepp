package ssafy.age.backend.event.persistence;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.lang.NonNull;
import ssafy.age.backend.NotImplementedException;
import ssafy.age.backend.NotJpaRepository;

@SuppressWarnings({"SpringDataMethodInconsistencyInspection"})
public class MemoryEventRepository implements EventRepository, NotJpaRepository<Event> {

    @Override
    public List<Event> findAllByOccurredAtBetween(LocalDateTime start, LocalDateTime end) {
        throw new NotImplementedException();
    }

    @Override
    public List<Event> findAllEventsByMemberId(Long memberId) {
        throw new NotImplementedException();
    }

    @Override
    public Integer countTodayEventsByMemberId(
            Long memberId, LocalDateTime startOfDay, LocalDateTime endOfDay) {
        throw new NotImplementedException();
    }

    @Override
    @NonNull public List<Event> findAll() {
        throw new NotImplementedException();
    }
}
