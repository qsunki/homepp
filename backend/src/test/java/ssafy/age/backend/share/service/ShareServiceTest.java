package ssafy.age.backend.share.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.*;

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
import ssafy.age.backend.member.persistence.MemoryMemberRepository;
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
    MemoryMemberRepository fakeMemberRepository = new MemoryMemberRepository();

    ShareService shareService;

    @BeforeEach
    void setUp() {
        shareService = new ShareService(memberRepository, shareRepository, fcmService);
        given(shareRepository.findAllBySharingMemberEmail(anyString()))
                .willAnswer(
                        invocation ->
                                fakeShareRepository.findAllBySharingMemberEmail(
                                        invocation.getArgument(0)));
        given(memberRepository.findByEmail(anyString()))
                .willAnswer(
                        invocation -> fakeMemberRepository.findByEmail(invocation.getArgument(0)));
        given(
                        shareRepository.findBySharingMemberEmailAndSharedMemberEmail(
                                anyString(), anyString()))
                .willAnswer(
                        invocation ->
                                fakeShareRepository
                                        .findBySharingMemberEmailAndSharedMemberEmail(
                                                invocation.getArgument(0),
                                                invocation.getArgument(1))
                                        .orElseThrow());
        willAnswer(
                        invocation -> {
                            fakeShareRepository.delete(invocation.getArgument(0));
                            return null;
                        })
                .given(shareRepository)
                .delete(any(Share.class));
    }

    @Test
    @DisplayName("공유 목록을 가져올 때 이메일과 닉네임 리스트를 반환한다.")
    void getAllShares() {
        // given
        Member me = new Member("me@example.com", "password", "010-0000-0000");
        Member mother = new Member("mother@example.com", "password", "010-0000-0000");
        Member father = new Member("father@example.com", "password", "010-0000-0000");
        fakeMemberRepository.save(me);
        fakeMemberRepository.save(mother);
        fakeMemberRepository.save(father);
        Share share1 = new Share(me, mother, "mother");
        Share share2 = new Share(me, father, "father");
        fakeShareRepository.save(share1);
        fakeShareRepository.save(share2);
        ShareDto shareDto1 = new ShareDto(mother.getEmail(), share1.getNickname());
        ShareDto shareDto2 = new ShareDto(father.getEmail(), share2.getNickname());

        // when
        List<ShareDto> shareDtos = shareService.getAllShares(me.getEmail());

        // then
        assertThat(shareDtos).hasSize(2).containsExactlyInAnyOrder(shareDto1, shareDto2);
    }

    @Test
    @DisplayName("공유회원을 등록할 때 공유된 회원 이메일과 닉네임을 반환한다.")
    void createShare() {
        // given
        Member sharingMember = new Member("sharing@example.com", "password", "010-0000-0000");
        Member sharedMember = new Member("shared@example.com", "password", "010-0000-0001");
        fakeMemberRepository.save(sharingMember);
        fakeMemberRepository.save(sharedMember);
        String nickname = "friend";
        ShareDto expectedShareDto = new ShareDto(sharedMember.getEmail(), nickname);

        // when
        ShareDto shareDto =
                shareService.createShare(
                        sharingMember.getEmail(), sharedMember.getEmail(), nickname);

        // then
        assertThat(shareDto).isEqualTo(expectedShareDto);
    }

    @Test
    @DisplayName("가입되지 않은 이메일의 공유를 생성할 때 SharedMemberNotFoundException이 발생")
    void givenInvalidSharedMemberEmail_whenCreateShare_thenThrowSharedMemberNotFoundException() {
        // given
        String sharingMemberEmail = "sharing@example.com";
        Member sharingMember = new Member(sharingMemberEmail, "password", "010-0000-0000");
        String invalidSharedEmail = "shared@example.com";
        fakeMemberRepository.save(sharingMember);

        // when & then
        assertThatThrownBy(
                        () ->
                                shareService.createShare(
                                        sharingMemberEmail, invalidSharedEmail, "friend"))
                .isInstanceOf(MemberNotFoundException.class);
    }

    @Test
    @DisplayName("공유를 업데이트할 때, 업데이트된 닉네임과 원래의 공유받은 이메일 반환한다.")
    void updateShare() {
        // given
        Member sharingMember = new Member("sharingMember@example.com", "password", "010-0000-0000");
        Member sharedMember = new Member("sharedMember@example.com", "password", "010-0000-0001");
        fakeMemberRepository.save(sharingMember);
        fakeMemberRepository.save(sharedMember);
        Share share = new Share(sharingMember, sharedMember, "friend");
        fakeShareRepository.save(share);

        // when
        String updatedNickname = "best friend";
        shareService.updateShare(
                sharingMember.getEmail(), sharedMember.getEmail(), updatedNickname);

        // then
        assertThat(
                        shareRepository
                                .findBySharingMemberEmailAndSharedMemberEmail(
                                        sharingMember.getEmail(), sharedMember.getEmail())
                                .getNickname())
                .isEqualTo(updatedNickname);
    }

    @Test
    @DisplayName("공유를 삭제할 때 삭제 성공한다.")
    void deleteShare() {
        // given
        Member me = new Member("me@example.com", "password", "010-0000-0000");
        Member mother = new Member("mother@example.com", "password", "010-0000-0000");
        Member father = new Member("father@example.com", "password", "010-0000-0000");
        fakeMemberRepository.save(me);
        fakeMemberRepository.save(mother);
        fakeMemberRepository.save(father);
        Share share1 = new Share(me, mother, "mother");
        Share share2 = new Share(me, father, "father");
        fakeShareRepository.save(share1);
        fakeShareRepository.save(share2);

        // when
        shareService.deleteShare(me.getEmail(), mother.getEmail());

        // then
        assertThat(fakeShareRepository.findAllBySharingMemberEmail(me.getEmail()))
                .hasSize(1)
                .containsExactly(share2);
    }
}
