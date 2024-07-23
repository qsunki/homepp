package ssafy.age.backend.cam.persistence;

import jakarta.persistence.*;
import lombok.*;
import ssafy.age.backend.member.persistence.Member;

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

    @Enumerated(EnumType.STRING)
    private CamStatus status;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    public Cam(Long id, String name, String ip, CamStatus status, Member member) {
        this.id = id;
        this.name = name;
        this.ip = ip;
        this.status = status;
        this.member = member;
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
}
