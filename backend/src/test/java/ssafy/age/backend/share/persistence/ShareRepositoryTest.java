package ssafy.age.backend.share.persistence;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberRepository;

@DataJpaTest
class ShareRepositoryTest {

    @Autowired private ShareRepository shareRepository;
    @Autowired private MemberRepository memberRepository;

    @Test
    void findAllByMemberEmail() {
        // Given
        String email = "test@example.com";
        String password = "password123";
        String phoneNumber = "123-456-7890";
        Member member = new Member(email, password, phoneNumber);

        memberRepository.save(member);

        Share share1 = Share.builder().member(member).nickname("nickname1").build();

        Share share2 = Share.builder().member(member).nickname("nickname2").build();

        shareRepository.save(share1);
        shareRepository.save(share2);

        // When
        List<Share> shares = shareRepository.findAllByMemberEmail(email);

        // Then
        assertNotNull(shares);
        assertEquals(2, shares.size());
        assertTrue(shares.stream().anyMatch(share -> "nickname1".equals(share.getNickname())));
        assertTrue(shares.stream().anyMatch(share -> "nickname2".equals(share.getNickname())));
    }

    @Test
    void findByMemberEmailAndSharedMemberEmail() {
        // Given
        String email1 = "test@example.com";
        String password = "password123";
        String phoneNumber = "123-456-7890";
        Member member = new Member(email1, password, phoneNumber);

        String email2 = "shared@example.com";
        Member sharedMember = new Member(email2, password, phoneNumber);

        memberRepository.save(member);
        memberRepository.save(sharedMember);

        Share share =
                Share.builder()
                        .member(member)
                        .sharedMember(sharedMember)
                        .nickname("nickname")
                        .build();

        shareRepository.save(share);

        // When
        Share foundShare = shareRepository.findByMemberEmailAndSharedMemberEmail(email1, email2);

        // Then
        assertNotNull(foundShare);
        assertEquals(email1, foundShare.getMember().getEmail());
        assertEquals(email2, foundShare.getSharedMember().getEmail());
    }
}
