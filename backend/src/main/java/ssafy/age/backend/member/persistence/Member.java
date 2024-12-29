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

    @OneToMany(mappedBy = "sharingMember")
    private final List<Share> shareList = new ArrayList<>();

    public Member(String email, String password, String phoneNumber) {
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
    }

    public void update(String password, String phoneNumber) {
        this.password = password;
        this.phoneNumber = phoneNumber;
    }

    protected void setId(Long id) {
        this.id = id;
    }
}
