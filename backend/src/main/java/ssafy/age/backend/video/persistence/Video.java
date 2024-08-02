package ssafy.age.backend.video.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
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

    private LocalDateTime recordStartAt;

    private LocalDateTime recordEndAt;

    private String url;

    private Long length;

    @OneToMany(mappedBy = "video")
    private List<Event> eventList = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cam_id")
    private Cam cam;

    @Setter private String thumbnailUrl;

    private Boolean isThreat;

    @Builder
    public Video(
            Long id,
            LocalDateTime recordStartAt,
            LocalDateTime recordEndAt,
            String url,
            Long length,
            Cam cam,
            String thumbnailUrl,
            Boolean isThreat) {
        this.id = id;
        this.recordStartAt = recordStartAt;
        this.recordEndAt = recordEndAt;
        this.url = url;
        this.length = length;
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
        this.recordStartAt = recordStartAt;
        this.recordEndAt = recordEndAt;
        this.length = length;
        this.thumbnailUrl = thumbnailFilePath;
    }

    public void registerThreat() {
        this.isThreat = true;
    }
}
