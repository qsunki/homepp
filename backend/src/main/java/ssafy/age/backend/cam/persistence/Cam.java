package ssafy.age.backend.cam.persistence;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.*;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.video.persistence.Video;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "cam")
@Builder
public class Cam {
    @Id
    @Column(name = "cam_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String ip;

    @Setter private String region;

    @Enumerated(EnumType.STRING)
    private CamStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "cam")
    @Builder.Default
    private List<Video> videoList = new ArrayList<>();

    @Setter private String thumbnailUrl;

    public Cam(
            Long id,
            String name,
            String ip,
            String region,
            CamStatus status,
            Member member,
            List<Video> videoList,
            String thumbnailUrl) {
        this.id = id;
        this.name = name;
        this.ip = ip;
        this.region = region;
        this.status = status;
        this.member = member;
        this.videoList = videoList;
        this.thumbnailUrl = thumbnailUrl;
    }

    public void updateCamName(String name) {
        this.name = name;
    }

    public void registerMember(Member member) {
        this.member = member;
        this.status = CamStatus.REGISTERED;
    }

    public void unregisterCam() {
        this.status = CamStatus.UNREGISTERED;
    }

    public void addVideo(Video video) {
        this.videoList.add(video);
    }
}
