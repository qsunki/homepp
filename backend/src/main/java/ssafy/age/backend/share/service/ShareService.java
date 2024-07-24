package ssafy.age.backend.share.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.age.backend.auth.service.AuthService;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemberRepository;
import ssafy.age.backend.share.persistence.Share;
import ssafy.age.backend.share.persistence.ShareRepository;
import ssafy.age.backend.share.web.ShareDto;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShareService {

    private final MemberRepository memberRepository;
    private final AuthService authService;
    private final ShareRepository shareRepository;
    private final ShareMapper shareMapper = ShareMapper.INSTANCE;

    public List<ShareDto> getAllShares() {
        List<Share> shareList = shareRepository.findAll();
        return shareList.stream().map(shareMapper::toShareDto).toList();

    }

    public void deleteShare(String email) {
        Member member = memberRepository.findByEmail(email);
        Share share = shareRepository.findBySharedMemberIdEmail(member.getEmail());
        shareRepository.delete(share);
    }

    public ShareDto createShare(String email, String nickname) {

        Member loginMember  = memberRepository.findByEmail(authService.getMemberEmail());

        Member sharedMember = memberRepository.findByEmail(email);

        Share share = Share.builder()
                .member(loginMember)
                .sharedMemberId(sharedMember)
                .nickname(nickname)
                .build();

        shareRepository.save(share);

        return shareMapper.toShareDto(share);
    }


}
