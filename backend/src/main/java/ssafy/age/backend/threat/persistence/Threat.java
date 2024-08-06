package ssafy.age.backend.threat.persistence;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.video.persistence.Video;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "threat_notification")
@Builder
public class Threat {

    private static final Logger log = LoggerFactory.getLogger(Threat.class);

    @Id
    @Column(name = "threat_id")
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_id")
    private Video video;

    private Boolean isRead;

    public void read() {
        this.isRead = true;
    }

    public Threat(Long id, Member member, Video video, Boolean isRead) {
        this.id = id;
        this.member = member;
        this.video = video;
        this.isRead = isRead;
    }
}
