package ssafy.age.backend.cam.web;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.cam.persistence.CamStatus;
import ssafy.age.backend.cam.service.CamService;
import ssafy.age.backend.member.persistence.Member;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/cams")
public class CamController {

    private final CamService camService;

    @GetMapping
    public List<CamResponseDto> getAllCams() {
        return camService.getAllCams();
    }

    @PatchMapping("/{camId}")
    public CamResponseDto updateCam(@PathVariable Long camId,
                                    @RequestBody CamRequestDto camRequestDto,
                                    @AuthenticationPrincipal Member member) {
        if (camRequestDto.getStatus() == null) {
            return camService.updateCamName(camId, camRequestDto.getName());
        } else {
            if (camRequestDto.getStatus() == CamStatus.UNREGISTERED) {
                return camService.registerCam(camId, member);
            }
            else {
                return camService.unregisterCam(camId);
            }
        }
    }
}