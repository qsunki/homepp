package ssafy.age.backend.event.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.video.persistence.Video;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "event")
@Builder
@ToString
public class Event {
    @Id
    @Column(name = "event_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp private LocalDateTime occurredAt;

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

    public void read() {
        this.isRead = true;
    }
}
