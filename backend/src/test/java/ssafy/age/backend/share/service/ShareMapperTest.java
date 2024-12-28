package ssafy.age.backend.share.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.share.persistence.Share;
import ssafy.age.backend.share.web.ShareDto;

class ShareMapperTest {

    ShareMapper shareMapper = ShareMapper.INSTANCE;

    @Test
    void toShareDto() {
        // given
        String email = "shared@example.com";
        Member sharedMember = new Member(email, "password123", "123-456-7890");

        String nickname = "nickname";
        Share share = Share.builder().sharedMember(sharedMember).nickname(nickname).build();

        // when
        ShareDto shareDto = shareMapper.toShareDto(share);

        // then
        assertNotNull(shareDto);
        assertEquals(email, shareDto.getEmail());
        assertEquals(nickname, shareDto.getNickname());
    }
}
