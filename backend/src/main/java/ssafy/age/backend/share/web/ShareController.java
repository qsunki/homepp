package ssafy.age.backend.share.web;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.share.service.ShareService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/members/{email}/sharedMembers")
@RequiredArgsConstructor
public class ShareController {

    private final ShareService shareService;

    @GetMapping
    public List<ShareDto> getAllShares() {
        List<ShareDto> shareDtoList = shareService.getAllShares();
        return shareDtoList.stream().toList();
    }

    @PostMapping
    public ShareDto createShare(@RequestBody ShareDto shareDto) {
        return shareService.createShare(shareDto.getEmail(), shareDto.getNickname());

    }

    @DeleteMapping("/{sharedMemberEmail}")
    public void deleteShare(@PathVariable String sharedMemberEmail) {shareService.deleteShare(sharedMemberEmail);}


}
