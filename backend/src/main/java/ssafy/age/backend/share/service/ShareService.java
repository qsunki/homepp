package ssafy.age.backend.share.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
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

    private static final ShareMapper shareMapper = ShareMapper.INSTANCE;

    private final MemberRepository memberRepository;
    private final ShareRepository shareRepository;
    private final FCMService fcmService;

    @Transactional
    public List<ShareDto> getAllShares(String email) {
        List<Share> shareList = shareRepository.findAllBySharingMemberEmail(email);
        return shareList.stream().map(shareMapper::toShareDto).toList();
    }

    @Transactional
    public ShareDto createShare(String email, String sharedMemberEmail, String nickname) {
        Member member = memberRepository.findByEmail(email).orElseThrow(MemberNotFoundException::new);
        Member sharedMember = memberRepository.findByEmail(sharedMemberEmail).orElseThrow(MemberNotFoundException::new);

        Share share = new Share(member, sharedMember, nickname);

        shareRepository.save(share);
        fcmService.sendSharedMessage(email, sharedMemberEmail);

        return shareMapper.toShareDto(share);
    }

    @Transactional
    public ShareDto updateShare(String email, String sharedMemberEmail, String nickname) {
        Share share = shareRepository.findBySharingMemberEmailAndSharedMemberEmail(email, sharedMemberEmail);
        share.updateNickname(nickname);
        shareRepository.save(share);

        return shareMapper.toShareDto(share);
    }

    @Transactional
    public void deleteShare(String email, String sharedMemberEmail) {
        Share share = shareRepository.findBySharingMemberEmailAndSharedMemberEmail(email, sharedMemberEmail);
        shareRepository.delete(share);
    }
}
