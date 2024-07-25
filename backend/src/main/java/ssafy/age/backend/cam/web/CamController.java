package ssafy.age.backend.cam.web;

import io.swagger.v3.oas.annotations.Operation;
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
    @Operation(summary = "cam 목록 조회", description = "모든 cam 목록 조회")
    public List<CamResponseDto> getAllCams() {
        return camService.getAllCams();
    }

    @PatchMapping("/{camId}")
    @Operation(summary = "캠 정보 수정",
            description = "status null이면 이름만 수정, 등록되어 있으면 unregister, 등록되어 있지 않으면 register")
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