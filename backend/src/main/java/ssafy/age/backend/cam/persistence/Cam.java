package ssafy.age.backend.cam.persistence;

import jakarta.persistence.*;
import lombok.*;
import ssafy.age.backend.member.persistence.Member;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cam {
    @Id
    @Column(name = "cam_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String ip;

    private String region;

    @Enumerated(EnumType.STRING)
    private CamStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private String thumbnailUrl;

    public static Cam create(String ip, String region, Member member) {
        return new Cam(null, ip, region, CamStatus.REGISTERED, member, null);
    }

    public Cam(String name, String ip, String region, CamStatus status, Member member, String thumbnailUrl) {
        this.name = name;
        this.ip = ip;
        this.region = region;
        this.status = status;
        this.member = member;
        this.thumbnailUrl = thumbnailUrl;
    }

    public void updateName(String name) {
        this.name = name;
    }

    public void updateThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    protected void setId(Long id) {
        this.id = id;
    }
}
