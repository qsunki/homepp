package ssafy.age.backend.share.persistence;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ShareRepositoryTest {

    @Autowired
    private ShareRepository shareRepository;
    @Autowired
    private MemberRepository memberRepository;

    @Test
    void findAllByMemberEmail() {
        // Given
        Member member = Member.builder()
                .email("test@example.com")
                .password("password123")
                .phoneNumber("123-456-7890")
                .build();

        memberRepository.save(member);

        Share share1 = Share.builder()
                .member(member)
                .nickname("nickname1")
                .build();

        Share share2 = Share.builder()
                .member(member)
                .nickname("nickname2")
                .build();

        shareRepository.save(share1);
        shareRepository.save(share2);


        // When
        List<Share> shares = shareRepository.findAllByMemberEmail("test@example.com");

        // Then
        assertNotNull(shares);
        assertEquals(2, shares.size());
        assertTrue(shares.stream().anyMatch(share -> "nickname1".equals(share.getNickname())));
        assertTrue(shares.stream().anyMatch(share -> "nickname2".equals(share.getNickname())));
    }

    @Test
    void findByMemberEmailAndSharedMemberEmail() {
        // Given
        Member member = Member.builder()
                .email("test@example.com")
                .password("password123")
                .phoneNumber("123-456-7890")
                .build();

        Member sharedMember = Member.builder()
                .email("shared@example.com")
                .password("password123")
                .phoneNumber("123-456-7890")
                .build();

        memberRepository.save(member);
        memberRepository.save(sharedMember);

        Share share = Share.builder()
                .member(member)
                .sharedMember(sharedMember)
                .nickname("nickname")
                .build();

        shareRepository.save(share);

        // When
        Share foundShare = shareRepository.findByMemberEmailAndSharedMemberEmail("test@example.com", "shared@example.com");

        // Then
        assertNotNull(foundShare);
        assertEquals("test@example.com", foundShare.getMember().getEmail());
        assertEquals("shared@example.com", foundShare.getSharedMember().getEmail());
    }
}
