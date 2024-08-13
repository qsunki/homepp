package ssafy.age.backend.member.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.notification.persistence.FCMToken;
import ssafy.age.backend.share.persistence.Share;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "member")
@Builder
public class Member {

    @Id
    @Column(name = "member_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @CreationTimestamp private LocalDateTime createdAt;

    @Column(nullable = false)
    private String phoneNumber;

    @OneToMany(mappedBy = "member")
    @Builder.Default
    private List<FCMToken> fcmTokenList = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    @Builder.Default
    private List<Cam> camList = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    @Builder.Default
    private List<Share> shareList = new ArrayList<>();

    public Member(
            Long id,
            String email,
            String password,
            LocalDateTime createdAt,
            String phoneNumber,
            List<FCMToken> fcmTokenList,
            List<Cam> camList,
            List<Share> shareList) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.phoneNumber = phoneNumber;
        this.fcmTokenList = fcmTokenList;
        this.camList = camList;
        this.shareList = shareList;
    }

    public Member(String email, String password, String phoneNumber, List<String> roles) {
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
    }

    public void updateMember(String password, String phoneNumber) {
        this.password = password;
        this.phoneNumber = phoneNumber;
    }
}
