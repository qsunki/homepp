package ssafy.age.backend.video.persistence;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ssafy.age.backend.event.persistence.Event;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor
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
}