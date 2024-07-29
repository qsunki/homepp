package ssafy.age.backend.share.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.age.backend.auth.service.AuthService;
import ssafy.age.backend.member.exception.MemberNotFoundException;
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

    @Transactional
    public List<ShareDto> getAllShares() {
        List<Share> shareList = shareRepository.findAll();
        return shareList.stream().map(shareMapper::toShareDto).toList();
    }
    @Transactional
    public void deleteShare(String email) {
        Member member = memberRepository.findByEmail(email);

        Share share = shareRepository.findBySharedMemberEmail(member.getEmail());
        if (share == null) {
            throw new MemberNotFoundException();
        }
        shareRepository.delete(share);
    }
    @Transactional
    public ShareDto createShare(String email, String nickname) {

        Member loginMember = memberRepository.findByEmail(authService.getMemberEmail());
        Member sharedMember = memberRepository.findByEmail(email);

        if (sharedMember == null) {
            throw new MemberNotFoundException();
        }

        Share share =
                Share.builder()
                        .member(loginMember)
                        .sharedMember(sharedMember)
                        .nickname(nickname)
                        .build();

        shareRepository.save(share);

        return shareMapper.toShareDto(share);
    }
    @Transactional
    public ShareDto updateShare(String email, String nickname) {
        Member loginMember = memberRepository.findByEmail(authService.getMemberEmail());

        Member sharedMember = memberRepository.findByEmail(email);
        if (sharedMember == null) {
            throw new MemberNotFoundException();
        }
        Share share = shareRepository.findBySharedMemberEmail(sharedMember.getEmail());
        share.setNickname(nickname);
        shareRepository.save(share);

        return shareMapper.toShareDto(share);
    }
}
