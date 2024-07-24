package ssafy.age.backend.share.web;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.share.persistence.Share;
import ssafy.age.backend.share.persistence.ShareRepository;
import ssafy.age.backend.share.service.ShareMapper;
import ssafy.age.backend.share.service.ShareService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/members/{email}/sharedMembers")
@RequiredArgsConstructor
public class ShareController {

    private final ShareService shareService;
    private final ShareMapper shareMapper;

    @GetMapping
    public List<ShareDto> getAllShares() {
        List<ShareDto> shareDtoList = shareService.getAllShares();
        return shareDtoList.stream().toList();
    }

    @PostMapping
    public ShareDto createShare(@RequestBody ShareDto shareDto) {
        return shareService.createShare(shareDto);

    }

    @DeleteMapping("/{email}")
    public void deleteShare(@PathVariable String email) {shareService.deleteShare(email);}


}
