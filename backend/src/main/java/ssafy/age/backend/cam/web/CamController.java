package ssafy.age.backend.cam.web;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
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
    @Operation(summary = "캠 목록 조회", description = "모든 캠 목록 조회")
    public List<CamResponseDto> getAllCams() {
        return camService.getAllCams();
    }

    @PostMapping
    @Operation(summary = "캠 등록", description = "디바이스에서 요청을 보내서 캠 초기등록")
    public CamResponseDto createCam(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null) ip = request.getRemoteAddr();
        return camService.createCam(ip);
    }

    @PatchMapping("/{camId}")
    @Operation(summary = "캠 정보 수정",
            description = "request의 status가 null이면 이름 변경, 등록되어 있으면 unregister, 등록되어 있지 않으면 register")
    public CamResponseDto updateCam(@PathVariable Long camId,
                                    @RequestBody CamRequestDto camRequestDto,
                                    @AuthenticationPrincipal Member member) {
        if (camRequestDto.getStatus() == CamStatus.UNREGISTERED) {
                return camService.unregisterCam(camId);
        } else if (camRequestDto.getStatus() == CamStatus.REGISTERED) {
            return camService.registerCam(camId, member);
        } else {
            return camService.updateCamName(camId, camRequestDto.getName());
        }
    }
}