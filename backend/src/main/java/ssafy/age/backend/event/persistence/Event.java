package ssafy.age.backend.event.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.video.persistence.Video;

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

    @CreationTimestamp private LocalDateTime occurredAt;

    @Enumerated(EnumType.STRING)
    private EventType type;

    private Boolean isRead;

    private Boolean isThreat;

    @ManyToOne
    @JoinColumn(name = "cam_id")
    private Cam cam;

    @ManyToOne
    @JoinColumn(name = "video_id")
    private Video video;

    public Event(
            Long id,
            LocalDateTime occurredAt,
            EventType type,
            boolean isRead,
            boolean isThreat,
            Cam cam,
            Video video) {
        this.id = id;
        this.occurredAt = occurredAt;
        this.type = type;
        this.isRead = isRead;
        this.isThreat = isThreat;
        this.cam = cam;
        this.video = video;
    }

    public void read() {
        this.isRead = true;
    }

    public void registerThreat() {
        this.isThreat = true;
    }
}
