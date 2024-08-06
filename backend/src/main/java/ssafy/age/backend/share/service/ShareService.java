package ssafy.age.backend.share.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.age.backend.auth.service.AuthService;
import ssafy.age.backend.member.exception.MemberNotFoundException;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberRepository;
import ssafy.age.backend.share.exception.AccessDeniedException;
import ssafy.age.backend.share.persistence.Share;
import ssafy.age.backend.share.persistence.ShareRepository;
import ssafy.age.backend.share.web.ShareDto;

@Service
@RequiredArgsConstructor
public class ShareService {

    private final MemberRepository memberRepository;
    private final AuthService authService;
    private final ShareRepository shareRepository;
    private final ShareMapper shareMapper = ShareMapper.INSTANCE;

    @Transactional
    public List<ShareDto> getAllShares(String email) {
        verifyLoginUser(email);
        List<Share> shareList = shareRepository.findAllByMemberEmail(email);
        return shareList.stream().map(shareMapper::toShareDto).toList();
    }

    @Transactional
    public ShareDto createShare(String email, String sharedMemberEmail, String nickname) {
        verifyLoginUser(email);
        Member member =
                memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new);
        Member sharedMember =
                memberRepository
                        .findByEmail(sharedMemberEmail)
                        .orElseThrow(MemberNotFoundException::new);

        Share share =
                Share.builder()
                        .member(member)
                        .sharedMember(sharedMember)
                        .nickname(nickname)
                        .build();

        shareRepository.save(share);

        return shareMapper.toShareDto(share);
    }

    @Transactional
    public ShareDto updateShare(String email, String sharedMemberEmail, String nickname) {
        verifyLoginUser(email);
        Share share =
                shareRepository.findByMemberEmailAndSharedMemberEmail(email, sharedMemberEmail);
        share.setNickname(nickname);
        shareRepository.save(share);

        return shareMapper.toShareDto(share);
    }

    @Transactional
    public void deleteShare(String email, String sharedMemberEmail) {
        verifyLoginUser(email);

        Share share =
                shareRepository.findByMemberEmailAndSharedMemberEmail(email, sharedMemberEmail);
        shareRepository.delete(share);
    }

    private void verifyLoginUser(String email) {
        String loggedEmail = authService.getMemberEmail();

        if (!email.equals(loggedEmail)) {
            throw new AccessDeniedException();
        }
    }
}
