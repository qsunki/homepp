package ssafy.age.backend.member.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.notification.persistence.FCMToken;
import ssafy.age.backend.share.persistence.Share;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "member")
@Builder
public class Member implements UserDetails {

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
            List<Share> shareList,
            List<String> roles) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.phoneNumber = phoneNumber;
        this.fcmTokenList = fcmTokenList;
        this.camList = camList;
        this.shareList = shareList;
        this.roles = roles;
    }

    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    private List<String> roles = new ArrayList<>();

    public Member(String email, String password, String phoneNumber, List<String> roles) {
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }

    public void updateMember(String password, String phoneNumber) {
        this.password = password;
        this.phoneNumber = phoneNumber;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
