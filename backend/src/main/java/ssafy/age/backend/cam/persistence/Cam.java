package ssafy.age.backend.cam.persistence;

import jakarta.persistence.*;
import lombok.*;
import ssafy.age.backend.member.persistence.Member;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "cam")
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

    @Setter private String thumbnailUrl;

    @Builder
    public Cam(
            Long id,
            String name,
            String ip,
            String region,
            CamStatus status,
            Member member,
            String thumbnailUrl) {
        this.id = id;
        this.name = name;
        this.ip = ip;
        this.region = region;
        this.status = status;
        this.member = member;
        this.thumbnailUrl = thumbnailUrl;
    }

    public Cam(
            String name,
            String ip,
            String region,
            CamStatus status,
            Member member,
            String thumbnailUrl) {
        this.name = name;
        this.ip = ip;
        this.region = region;
        this.status = status;
        this.member = member;
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

    protected void setId(Long id) {
        this.id = id;
    }
}
