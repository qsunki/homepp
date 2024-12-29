package ssafy.age.backend.envinfo.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.envinfo.service.RecordStatus;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "ENV_INFO")
public class EnvInfo {

    @Id
    @Column(name = "env_info_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime recordedAt;
    private Double temperature;
    private Double humidity;

    @Enumerated(value = EnumType.STRING)
    @Setter
    private RecordStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cam_id")
    @Setter
    private Cam cam;

    @Builder
    public EnvInfo(
            Long id,
            LocalDateTime recordedAt,
            Double temperature,
            Double humidity,
            RecordStatus status,
            Cam cam) {
        this.id = id;
        this.recordedAt = recordedAt;
        this.temperature = temperature;
        this.humidity = humidity;
        this.status = status;
        this.cam = cam;
    }
}
