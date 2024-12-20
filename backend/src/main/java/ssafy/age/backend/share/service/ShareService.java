package ssafy.age.backend.share.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.age.backend.member.exception.MemberNotFoundException;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberRepository;
import ssafy.age.backend.notification.service.FCMService;
import ssafy.age.backend.share.persistence.Share;
import ssafy.age.backend.share.persistence.ShareRepository;
import ssafy.age.backend.share.web.ShareDto;

@Service
@RequiredArgsConstructor
public class ShareService {

    private final MemberRepository memberRepository;
    private final ShareRepository shareRepository;
    private final ShareMapper shareMapper = ShareMapper.INSTANCE;
    private final FCMService fcmService;

    @Transactional
    @PreAuthorize("#email == authentication.principal.email")
    public List<ShareDto> getAllShares(String email) {
        List<Share> shareList = shareRepository.findAllByMemberEmail(email);
        return shareList.stream().map(shareMapper::toShareDto).toList();
    }

    @Transactional
    @PreAuthorize("#email == authentication.principal.email")
    public ShareDto createShare(String email, String sharedMemberEmail, String nickname) {
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
        fcmService.sendSharedMessage(email, sharedMemberEmail);

        return shareMapper.toShareDto(share);
    }

    @Transactional
    @PreAuthorize("#email == authentication.principal.email")
    public ShareDto updateShare(String email, String sharedMemberEmail, String nickname) {
        Share share =
                shareRepository.findByMemberEmailAndSharedMemberEmail(email, sharedMemberEmail);
        share.setNickname(nickname);
        shareRepository.save(share);

        return shareMapper.toShareDto(share);
    }

    @Transactional
    @PreAuthorize("#email == authentication.principal.email")
    public void deleteShare(String email, String sharedMemberEmail) {
        Share share =
                shareRepository.findByMemberEmailAndSharedMemberEmail(email, sharedMemberEmail);
        shareRepository.delete(share);
    }
}
