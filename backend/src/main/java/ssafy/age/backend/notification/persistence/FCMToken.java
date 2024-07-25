package ssafy.age.backend.notification.persistence;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ssafy.age.backend.member.persistence.Member;

@Entity
@NoArgsConstructor
@Getter
public class FCMToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    public FCMToken(String token) {
        this.token = token;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    public Member member;
}
