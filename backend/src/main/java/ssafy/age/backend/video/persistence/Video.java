package ssafy.age.backend.video.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.event.persistence.Event;

@Getter
@Entity
@NoArgsConstructor
public class Video {

    @Id
    @Column(name = "video_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime recordStartedAt;

    private String url;

    private Long length;

    @OneToMany(mappedBy = "video")
    private List<Event> events;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cam_id")
    private Cam cam;

    @Setter private String thumbnailUrl;

    private Boolean isThreat;

    @Builder
    public Video(
            Long id,
            LocalDateTime recordStartedAt,
            LocalDateTime recordEndedAt,
            String url,
            Long length,
            List<Event> events,
            Cam cam,
            String thumbnailUrl,
            Boolean isThreat) {
        this.id = id;
        this.recordStartedAt = recordStartedAt;
        this.url = url;
        this.length = length;
        this.events = events;
        this.cam = cam;
        this.thumbnailUrl = thumbnailUrl;
        this.isThreat = isThreat;
    }

    public void updateVideo(
            String url,
            LocalDateTime recordStartAt,
            LocalDateTime recordEndAt,
            Long length,
            String thumbnailFilePath) {
        this.url = url;
        this.recordStartedAt = recordStartAt;
        this.length = length;
        this.thumbnailUrl = thumbnailFilePath;
    }

    public void registerThreat() {
        this.isThreat = true;
    }
}
