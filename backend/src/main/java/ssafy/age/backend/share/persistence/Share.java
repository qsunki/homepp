package ssafy.age.backend.share.persistence;

import jakarta.persistence.*;
import lombok.*;
import ssafy.age.backend.member.persistence.Member;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Share {
    @Id
    @Column(name = "share_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_member_id")
    private Member sharedMember;

    @Setter private String nickname;

    @Builder
    public Share(Long id, Member member, Member sharedMember, String nickname) {
        this.id = id;
        this.member = member;
        this.sharedMember = sharedMember;
        this.nickname = nickname;
    }

    public Share(Member member, Member sharedMember, String nickname) {
        this.member = member;
        this.sharedMember = sharedMember;
        this.nickname = nickname;
    }
}
