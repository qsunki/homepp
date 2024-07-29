package ssafy.age.backend.envInfo.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.envInfo.service.RecordStatus;

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
    private double temperature;
    private double humidity;

    @Enumerated(value = EnumType.STRING)
    private RecordStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cam_id")
    @Setter
    private Cam cam;
}
