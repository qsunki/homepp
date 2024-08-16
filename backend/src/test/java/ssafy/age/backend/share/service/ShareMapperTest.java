package ssafy.age.backend.share.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.share.persistence.Share;
import ssafy.age.backend.share.web.ShareDto;

class ShareMapperTest {

    private ShareMapper shareMapper = ShareMapper.INSTANCE;

    @Test
    void toShareDto() {
        // Given
        Member sharedMember = Member.builder().email("shared@example.com").build();

        Share share = Share.builder().sharedMember(sharedMember).nickname("nickname").build();

        // When
        ShareDto shareDto = shareMapper.toShareDto(share);

        // Then
        assertNotNull(shareDto);
        assertEquals("shared@example.com", shareDto.getEmail());
        assertEquals("nickname", shareDto.getNickname());
    }
}
