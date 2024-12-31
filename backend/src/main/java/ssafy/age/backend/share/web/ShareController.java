package ssafy.age.backend.share.web;

import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.security.service.MemberInfoDto;
import ssafy.age.backend.share.service.ShareService;

@Slf4j
@RestController
@RequestMapping("/api/v1/shared-members")
@RequiredArgsConstructor
public class ShareController {

    private final ShareService shareService;

    @Operation(
            summary = "비디오를 공유해 줄 회원 목록",
            description = "로그인 된 회원의 비디오를 공유해 줄 회원 목록(이메일과 닉네임)을 가져옵니다.")
    @GetMapping
    public List<ShareDto> getAllShares(@AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        return shareService.getAllShares(memberInfoDto.getEmail());
    }

    @Operation(
            summary = "비디오 공유해 줄 회원 추가",
            description = "로그인 된 회원의 비디오를 공유해 줄 회원(이메일과 닉네임)을 추가합니다.")
    @PostMapping
    public ShareDto createShare(
            @AuthenticationPrincipal MemberInfoDto memberInfoDto, @RequestBody ShareDto shareDto) {
        return shareService.createShare(
                memberInfoDto.getEmail(), shareDto.getEmail(), shareDto.getNickname());
    }

    @Operation(summary = "비디오 공유해 줄 회원 수정", description = "로그인 된 회원의 비디오를 공유해 준 회원의 닉네임을 변경합니다.")
    @PatchMapping("/{sharedMemberEmail}")
    public ShareDto updateShare(
            @AuthenticationPrincipal MemberInfoDto memberInfoDto,
            @PathVariable String sharedMemberEmail,
            @RequestBody ShareDto shareDto) {
        return shareService.updateShare(
                memberInfoDto.getEmail(), sharedMemberEmail, shareDto.getNickname());
    }

    @Operation(summary = "비디오 공유해 줄 회원 삭제", description = "공유 받았던 회원의 이메일로 비디오를 공유할 목록에서 삭제합니다.")
    @DeleteMapping("/{sharedMemberEmail}")
    public void deleteShare(
            @AuthenticationPrincipal MemberInfoDto memberInfoDto,
            @PathVariable String sharedMemberEmail) {
        shareService.deleteShare(memberInfoDto.getEmail(), sharedMemberEmail);
    }
}
