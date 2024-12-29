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
    @JoinColumn(name = "sharing_member_id")
    private Member sharingMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_member_id")
    private Member sharedMember;

    @Setter private String nickname;

    @Builder
    public Share(Long id, Member sharingMember, Member sharedMember, String nickname) {
        this.id = id;
        this.sharingMember = sharingMember;
        this.sharedMember = sharedMember;
        this.nickname = nickname;
    }

    public Share(Member sharingMember, Member sharedMember, String nickname) {
        this.sharingMember = sharingMember;
        this.sharedMember = sharedMember;
        this.nickname = nickname;
    }
}
