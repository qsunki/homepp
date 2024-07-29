package ssafy.age.backend.share.persistence;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ssafy.age.backend.member.persistence.Member;

@Getter
@Entity
@NoArgsConstructor
@Builder
public class Share {
    @Id
    @Column(name = "share_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_mameber_id")
    private Member sharedMember;

    @Setter private String nickname;

    public Share(Long id, Member member, Member sharedMember, String nickname) {
        this.id = id;
        this.member = member;
        this.sharedMember = sharedMember;
        this.nickname = nickname;
    }
}
