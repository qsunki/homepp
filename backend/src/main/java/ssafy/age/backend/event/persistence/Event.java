package ssafy.age.backend.event.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.video.persistence.Video;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Event {
    @Id
    @Column(name = "event_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime occurredAt;

    @Enumerated(EnumType.STRING)
    private EventType type;

    private Boolean isRead;

    @ManyToOne
    @JoinColumn(name = "cam_id")
    private Cam cam;

    @ManyToOne
    @JoinColumn(name = "video_id")
    private Video video;

    public Event(LocalDateTime occurredAt, EventType type, Cam cam) {
        this.occurredAt = occurredAt;
        this.type = type;
        this.isRead = false;
        this.cam = cam;
    }

    public void read() {
        this.isRead = true;
    }
}
