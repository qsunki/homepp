package ssafy.age.backend.video.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
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

    @Setter
    private String streamUrl;

    @Setter
    private String downloadUrl;

    @Setter
    private String thumbnailUrl;

    private Boolean isThreat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cam_id")
    private Cam cam;

    @OneToMany(mappedBy = "video")
    private final List<Event> events = new ArrayList<>();

    public Video(LocalDateTime recordStartedAt, Long length, Cam cam) {
        this.recordStartedAt = recordStartedAt;
        this.length = length;
        this.cam = cam;
    }

    public void registerThreat() {
        this.isThreat = true;
    }
}
