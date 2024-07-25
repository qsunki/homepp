package ssafy.age.backend.video.persistence;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ssafy.age.backend.event.persistence.Event;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor
@Builder
public class Video {

    @Id
    @Column(name = "video_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "record_start_at")
    private LocalDateTime recordStartAt;

    @Column(name = "record_end_at")
    private LocalDateTime recordEndAt;

    private String url;

    private Long length;

    @OneToMany(mappedBy = "video")
    private List<Event> eventList;

    public Video(Long id, LocalDateTime recordStartAt, LocalDateTime recordEndAt, String url, Long length, List<Event> eventList) {
        this.id = id;
        this.recordStartAt = recordStartAt;
        this.recordEndAt = recordEndAt;
        this.url = url;
        this.length = length;
        this.eventList = eventList;
    }
}