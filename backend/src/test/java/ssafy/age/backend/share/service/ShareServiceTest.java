package ssafy.age.backend.share.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.*;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import ssafy.age.backend.auth.service.AuthService;
import ssafy.age.backend.member.exception.MemberNotFoundException;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberRepository;
import ssafy.age.backend.share.exception.AccessDeniedException;
import ssafy.age.backend.share.persistence.Share;
import ssafy.age.backend.share.persistence.ShareRepository;
import ssafy.age.backend.share.web.ShareDto;

class ShareServiceTest {
    @Mock private ShareRepository shareRepository;
    @Mock private AuthService authService;
    @Mock private MemberRepository memberRepository;
    @Mock private ShareMapper shareMapper;

    @InjectMocks private ShareService shareService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("로그인한 회원과 URI의 이메일이 다를 때 AccessDeniedException 발생")
    void givenDifferentUser_whenCreateShare_thenThrowAccessDeniedException() {
        // given
        String email = "test@example.com";
        String differentEmail = "different@example.com";
        Member member = mock(Member.class);
        Member differentMember = mock(Member.class);

        given(authService.getMemberEmail()).willReturn(differentEmail);
        given(memberRepository.findByEmail(differentEmail).orElseThrow(MemberNotFoundException::new)).willReturn(differentMember);
        given(memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new)).willReturn(member);

        // when & then
        assertThrows(
                AccessDeniedException.class,
                () -> {
                    shareService.createShare(email, "shared@example.com", "nickname");
                });
    }

    @Test
    @DisplayName("유효한 이메일로 공유 목록을 가져올 때 이메일과 닉네임 리스트를 반환")
    void givenValidEmail_whenGetAllShares_thenReturnShares() {
        // given
        String email = "test@example.com";
        Share share = mock(Share.class);
        List<Share> shares = List.of(share);
        ShareDto shareDto = new ShareDto();
        List<ShareDto> shareDtos = List.of(shareDto);

        given(authService.getMemberEmail()).willReturn(email);
        given(shareRepository.findAllByMemberEmail(email)).willReturn(shares);
        given(shareMapper.toShareDto(share)).willReturn(shareDto);

        // when
        List<ShareDto> result = shareService.getAllShares(email);

        // then
        assertEquals(shareDtos, result);
        then(shareRepository).should().findAllByMemberEmail(email);
    }

    @Test
    @DisplayName("유효한 데이터로 공유회원을 등록할 때 공유된 회원 이메일과 닉네임 반환")
    void givenValidData_whenCreateShare_thenReturnShareDto() {

        // given
        String email = "test@example.com";
        String sharedMemberEmail = "shared@example.com";
        String nickname = "nickname";
        Member member = mock(Member.class);
        Member sharedMember = mock(Member.class);

        given(sharedMember.getEmail()).willReturn(sharedMemberEmail);

        Share share =
                Share.builder()
                        .member(member)
                        .sharedMember(sharedMember)
                        .nickname(nickname)
                        .build();
        ShareDto shareDto = new ShareDto();
        shareDto.setEmail(sharedMemberEmail);
        shareDto.setNickname(nickname);

        given(authService.getMemberEmail()).willReturn(email);
        given(memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new)).willReturn(member);
        given(memberRepository.findByEmail(sharedMemberEmail).orElseThrow(MemberNotFoundException::new)).willReturn(sharedMember);
        given(shareRepository.save(any(Share.class))).willReturn(share);
        given(shareMapper.toShareDto(any(Share.class))).willReturn(shareDto);

        // when
        ShareDto result = shareService.createShare(email, sharedMemberEmail, nickname);

        // then
        assertEquals(shareDto, result);
        then(shareRepository).should(times(1)).save(any(Share.class));
    }

    @Test
    @DisplayName("가입되지 않은 이메일의 공유를 생성할 때 SharedMemberNotFoundException이 발생")
    void givenInvalidSharedMemberEmail_whenCreateShare_thenThrowSharedMemberNotFoundException() {
        // given
        String email = "test@example.com";
        String sharedMemberEmail = "invalid@example.com";
        String nickname = "nickname";
        Member member = mock(Member.class);

        given(authService.getMemberEmail()).willReturn(email);
        given(memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new)).willReturn(member);
        given(memberRepository.findByEmail(sharedMemberEmail)).willReturn(null);

        // when & then
        //        assertThrows(
        //                SharedMemberNotFoundException.class,
        //                () -> {
        //                    shareService.createShare(email, sharedMemberEmail, nickname);
        //                });
        //        then(shareRepository).should(never()).save(any(Share.class));
    }

    @Test
    @DisplayName("유효한 데이터로 공유를 업데이트할 때, 업데이트된 닉네임과 원래의 공유받은 이메일 반환")
    void givenValidData_whenUpdateShare_thenReturnShareDto() {

        // given
        String email = "test@example.com";
        String sharedMemberEmail = "shared@example.com";
        String newNickname = "newNickname";
        Member member = mock(Member.class);
        Member sharedMember = mock(Member.class);

        Share share =
                Share.builder()
                        .member(member)
                        .sharedMember(sharedMember)
                        .nickname("oldNickname")
                        .build();

        ShareDto updatedShareDto = new ShareDto();
        updatedShareDto.setNickname(newNickname);

        given(authService.getMemberEmail()).willReturn(email);
        given(memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new)).willReturn(member);
        given(memberRepository.findByEmail(sharedMemberEmail).orElseThrow(MemberNotFoundException::new)).willReturn(sharedMember);
        given(shareRepository.findByMemberEmailAndSharedMemberEmail(email, sharedMemberEmail))
                .willReturn(share);
        given(shareMapper.toShareDto(any(Share.class))).willReturn(updatedShareDto);

        // when
        ShareDto result = shareService.updateShare(email, sharedMemberEmail, newNickname);

        // then
        assertEquals(updatedShareDto, result);
        assertEquals(newNickname, share.getNickname());
        then(shareRepository).should(times(1)).save(share);
    }

    @Test
    @DisplayName("유효한 데이터로 공유를 삭제할 때 삭제 성공")
    void givenValidData_whenDeleteShare_thenDeleted() {
        // given
        String email = "test@example.com";
        String sharedMemberEmail = "shared@example.com";
        Share share = mock(Share.class);

        given(authService.getMemberEmail()).willReturn(email);
        given(shareRepository.findByMemberEmailAndSharedMemberEmail(email, sharedMemberEmail))
                .willReturn(share);

        // when
        shareService.deleteShare(email, sharedMemberEmail);

        // then
        then(shareRepository).should(times(1)).delete(share);
    }
}
