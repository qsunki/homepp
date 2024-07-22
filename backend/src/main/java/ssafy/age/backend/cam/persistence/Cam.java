package ssafy.age.backend.cam.persistence;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(nullable = false)
    private String name;

    @Column
    private String ip;

    @Column
    private CamStatus status;

    @Column
    private Long homeId;

    public Cam(Long id, String name, String ip, CamStatus status, Long homeId) {
        this.id = id;
        this.name = name;
        this.ip = ip;
        this.status = status;
        this.homeId = homeId;
    }

    public void updateCam(String name, String ip, CamStatus status, Long homeId) {
        this.name = name;
        this.ip = ip;
        this.status = status;
        this.homeId = homeId;
    }
}
