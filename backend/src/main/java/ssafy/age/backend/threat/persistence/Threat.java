package ssafy.age.backend.threat.persistence;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.video.persistence.Video;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Threat {

    @Id
    @Column(name = "threat_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean isRead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_id")
    private Video video;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    public Threat(Video video, Member member) {
        this.isRead = false;
        this.video = video;
        this.member = member;
    }

    public void read() {
        this.isRead = true;
    }
}
