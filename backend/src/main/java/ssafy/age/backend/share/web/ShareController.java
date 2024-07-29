package ssafy.age.backend.share.web;

import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.share.service.ShareService;

@Slf4j
@RestController
@RequestMapping("/api/v1/members/{email}/sharedMembers")
@RequiredArgsConstructor
public class ShareController {

    private final ShareService shareService;

    @Operation(
            summary = "비디오를 공유해 줄 회원 목록",
            description = "로그인 된 회원의 비디오를 공유해 줄 회원 목록(이메일과 닉네임)을 가져옵니다.")
    @GetMapping
    public List<ShareDto> getAllShares(@PathVariable String email) {
        List<ShareDto> shareDtoList = shareService.getAllShares(email);
        return shareDtoList.stream().toList();
    }

    @Operation(
            summary = "비디오 공유해 줄 회원 추가",
            description = "로그인 된 회원의 비디오를 공유해 줄 회원(이메일과 닉네임)을 추가합니다.")
    @PostMapping
    public ShareDto createShare(@PathVariable String email, @RequestBody ShareDto shareDto) {
        return shareService.createShare(email, shareDto.getEmail(), shareDto.getNickname());
    }

    @Operation(summary = "비디오 공유해 줄 회원 수정", description = "로그인 된 회원의 비디오를 공유해 준 회원의 닉네임을 변경합니다.")
    @PatchMapping("/{sharedMemberEmail}")
    public ShareDto updateShare(
            @PathVariable String email,
            @PathVariable String sharedMemberEmail,
            @RequestBody ShareDto shareDto) {
        return shareService.updateShare(email, sharedMemberEmail, shareDto.getNickname());
    }

    @Operation(summary = "비디오 공유해 줄 회원 삭제", description = "공유 받았던 회원의 이메일로 비디오를 공유할 목록에서 삭제합니다.")
    @DeleteMapping("/{sharedMemberEmail}")
    public void deleteShare(@PathVariable String email, @PathVariable String sharedMemberEmail) {
        shareService.deleteShare(email, sharedMemberEmail);
    }
}
