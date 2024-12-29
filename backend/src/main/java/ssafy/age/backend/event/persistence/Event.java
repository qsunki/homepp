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
    @Setter
    private Cam cam;

    @ManyToOne
    @JoinColumn(name = "video_id")
    @Setter
    private Video video;

    @Builder
    public Event(
            Long id,
            LocalDateTime occurredAt,
            EventType type,
            Boolean isRead,
            Cam cam,
            Video video) {
        this.id = id;
        this.occurredAt = occurredAt;
        this.type = type;
        this.isRead = isRead;
        this.cam = cam;
        this.video = video;
    }

    public Event(LocalDateTime occurredAt, EventType type, Boolean isRead, Cam cam, Video video) {
        this.occurredAt = occurredAt;
        this.type = type;
        this.isRead = isRead;
        this.cam = cam;
        this.video = video;
    }

    public void read() {
        this.isRead = true;
    }
}
