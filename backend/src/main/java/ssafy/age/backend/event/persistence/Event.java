package ssafy.age.backend.event.persistence;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "event")
@Builder
public class Event {
    @Id
    @Column(name = "event_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Date occurredAt;//TODO: LocalDateTime으로 할 것

    @Column
    private EventType type;

    @Column//TODO: 연관관계 수정
    private Long camId;

    @Column//TODO: 연관관계 수정
    private Long videoId;

    public Event(Long id, Date occurredAt, EventType type, Long camId, Long videoId) {
        this.id = id;
        this.occurredAt = occurredAt;
        this.type = type;
        this.camId = camId;
        this.videoId = videoId;
    }
}
