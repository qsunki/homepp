package ssafy.age.backend.member.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import ssafy.age.backend.share.persistence.Share;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "member")
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
    private List<Share> shareList = new ArrayList<>();

    @Builder
    public Member(
            Long id,
            String email,
            String password,
            LocalDateTime createdAt,
            String phoneNumber,
            List<Share> shareList) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.phoneNumber = phoneNumber;
        this.shareList = shareList;
    }

    public Member(String email, String password, String phoneNumber) {
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
    }

    public void updateMember(String password, String phoneNumber) {
        this.password = password;
        this.phoneNumber = phoneNumber;
    }

    protected void setId(Long id) {
        this.id = id;
    }
}
