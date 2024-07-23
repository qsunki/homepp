package ssafy.age.backend.share.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
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

    private final ShareRepository shareRepository;
    private final ShareMapper shareMapper = ShareMapper.ISTANCE;

    public List<ShareDto> getAllShares() {
        List<Share> shareList = shareRepository.findAll();
        return shareList.stream().map(shareMapper::toShareDto).toList();

    }

    public void deleteShare(String email) {
        Member member = memberRepository.findByEmail(email);
        Share share = shareRepository.findBySharedMemberIdEmail(member.getEmail());
        shareRepository.delete(share);
    }

    public ShareDto createShare(ShareDto shareDto) {

        // 로그인된 멤버...도 넣으면 되나?

        Member sharedMember = memberRepository.findByEmail(shareDto.getEmail());

        Share share = Share.builder()
                .sharedMemberId(sharedMember)
                .nickname(shareDto.getNickname())
                .build();

        shareRepository.save(share);

        return shareMapper.toShareDto(share);
    }


}
