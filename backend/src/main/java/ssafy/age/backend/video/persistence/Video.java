package ssafy.age.backend.video.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import lombok.*;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.event.persistence.Event;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Video {

    @Id
    @Column(name = "video_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime recordStartedAt;

    private Long length;

    @Setter private String streamUrl;
    @Setter private String downloadUrl;
    @Setter private String thumbnailUrl;
    private Boolean isThreat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cam_id")
    private Cam cam;

    @OneToMany(mappedBy = "video")
    private List<Event> events;

    @Builder
    public Video(
            Long id,
            LocalDateTime recordStartedAt,
            Long length,
            String streamUrl,
            String downloadUrl,
            String thumbnailUrl,
            Boolean isThreat,
            Cam cam,
            List<Event> events) {
        this.id = id;
        this.recordStartedAt = recordStartedAt;
        this.length = length;
        this.streamUrl = streamUrl;
        this.downloadUrl = downloadUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.isThreat = isThreat;
        this.cam = cam;
        this.events = events;
    }

    public Video(
            LocalDateTime recordStartedAt,
            Long length,
            String streamUrl,
            String downloadUrl,
            String thumbnailUrl,
            Boolean isThreat,
            Cam cam) {
        this.recordStartedAt = recordStartedAt;
        this.length = length;
        this.streamUrl = streamUrl;
        this.downloadUrl = downloadUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.isThreat = isThreat;
        this.cam = cam;
    }

    public void registerThreat() {
        this.isThreat = true;
    }
}
