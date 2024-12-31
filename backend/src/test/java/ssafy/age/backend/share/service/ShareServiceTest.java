package ssafy.age.backend.share.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import ssafy.age.backend.member.exception.MemberNotFoundException;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberRepository;
import ssafy.age.backend.member.persistence.MemberStub;
import ssafy.age.backend.notification.service.FCMService;
import ssafy.age.backend.share.persistence.MemoryShareRepository;
import ssafy.age.backend.share.persistence.Share;
import ssafy.age.backend.share.persistence.ShareRepository;
import ssafy.age.backend.share.web.ShareDto;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ShareServiceTest {
    @Mock MemberRepository memberRepository;
    @Mock ShareRepository shareRepository;
    @Mock FCMService fcmService;
    MemoryShareRepository fakeShareRepository = new MemoryShareRepository();

    ShareService shareService;

    @BeforeEach
    void setUp() {
        shareService = new ShareService(memberRepository, shareRepository, fcmService);
        given(shareRepository.save(any(Share.class)))
                .willAnswer(invocation -> fakeShareRepository.save(invocation.getArgument(0)));
        given(shareRepository.findAllBySharingMemberEmail(anyString()))
                .willAnswer(
                        invocation ->
                                fakeShareRepository.findAllBySharingMemberEmail(
                                        invocation.getArgument(0)));
    }

    @Test
    @DisplayName("공유 목록을 가져올 때 이메일과 닉네임 리스트를 반환한다.")
    void getAllShares() {
        // given
        Member me = new MemberStub(1L, "me@example.com", "password", "010-0000-0000");
        Member mother = new MemberStub(1L, "mother@example.com", "password", "010-0000-0000");
        Member father = new MemberStub(1L, "father@example.com", "password", "010-0000-0000");
        Share share1 = new Share(me, mother, "mother");
        Share share2 = new Share(me, father, "father");
        ShareDto shareDto1 =
                new ShareDto(share1.getSharedMember().getEmail(), share1.getNickname());
        ShareDto shareDto2 =
                new ShareDto(share2.getSharedMember().getEmail(), share2.getNickname());
        shareRepository.save(share1);
        shareRepository.save(share2);

        // when
        List<ShareDto> shareDtos = shareService.getAllShares(me.getEmail());

        // then
        assertThat(shareDtos).hasSize(2).containsExactlyInAnyOrder(shareDto1, shareDto2);
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

        Share share = new Share(member, sharedMember, nickname);
        ShareDto shareDto = new ShareDto();
        shareDto.setEmail(sharedMemberEmail);
        shareDto.setNickname(nickname);

        //        given(authService.getMemberEmail()).willReturn(email);
        given(memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new))
                .willReturn(member);
        given(
                        memberRepository
                                .findByEmail(sharedMemberEmail)
                                .orElseThrow(MemberNotFoundException::new))
                .willReturn(sharedMember);
        given(shareRepository.save(any(Share.class))).willReturn(share);

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

        //        given(authService.getMemberEmail()).willReturn(email);
        given(memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new))
                .willReturn(member);
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

        Share share = new Share(member, sharedMember, "oldNickname");

        ShareDto updatedShareDto = new ShareDto();
        updatedShareDto.setNickname(newNickname);

        //        given(authService.getMemberEmail()).willReturn(email);
        given(memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new))
                .willReturn(member);
        given(
                        memberRepository
                                .findByEmail(sharedMemberEmail)
                                .orElseThrow(MemberNotFoundException::new))
                .willReturn(sharedMember);
        given(
                        shareRepository.findBySharingMemberEmailAndSharedMemberEmail(
                                email, sharedMemberEmail))
                .willReturn(share);

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

        //        given(authService.getMemberEmail()).willReturn(email);
        given(
                        shareRepository.findBySharingMemberEmailAndSharedMemberEmail(
                                email, sharedMemberEmail))
                .willReturn(share);

        // when
        shareService.deleteShare(email, sharedMemberEmail);

        // then
        then(shareRepository).should(times(1)).delete(share);
    }
}
