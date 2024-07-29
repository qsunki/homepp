package ssafy.age.backend.cam.web;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ssafy.age.backend.cam.persistence.CamRepository;
import ssafy.age.backend.cam.persistence.CamStatus;
import ssafy.age.backend.cam.service.CamService;
import ssafy.age.backend.envInfo.service.EnvInfoService;
import ssafy.age.backend.exception.InvalidInputException;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.video.service.VideoTimeInfo;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/cams")
public class CamController {

    private final CamService camService;
    private final EnvInfoService envInfoService;
    private final CamRepository camRepository;

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

    @GetMapping("/{camId}")
    @Operation(summary = "캠 조회", description = "캠 id를 통해서 정보 조회")
    public CamResponseDto findCamById(@PathVariable Long camId) {
        return camService.findCamById(camId);
    }

    @PatchMapping("/{camId}")
    @Operation(
            summary = "캠 정보 수정",
            description =
                    "request의 status가 null이면 이름 변경, status 값이 있으면 값에 따라서 등록/미등록 상태 변경")
    public CamResponseDto updateCam(
            @PathVariable Long camId,
            @RequestBody CamRequestDto camRequestDto,
            @AuthenticationPrincipal Member member) {
        if (camRequestDto.getStatus() == CamStatus.UNREGISTERED) {
            return camService.unregisterCam(camId);
        } else if (camRequestDto.getStatus() == CamStatus.REGISTERED) {
            if (camRequestDto.getName() != null) {
                camService.updateCamName(camId, camRequestDto.getName());
            }
            return camService.registerCam(camId, member);
        } else {
            if (camRequestDto.getName() == null) {
                throw new InvalidInputException();
            }
            return camService.updateCamName(camId, camRequestDto.getName());
        }
    }

    @PostMapping("/{camId}/videos")
    public Long requestVideo(@PathVariable Long camId) {
        return camService.requestVideo(camId);
    }

    @PostMapping("/{camId}/videos/{videoId}")
    public CamResponseDto recordVideo(
            @PathVariable Long camId,
            @PathVariable Long videoId,
            @RequestPart MultipartFile file,
            @RequestPart VideoTimeInfo timeInfo) {
        return camService.recordVideo(camId, videoId, file, timeInfo);
    }
    //
    //    @GetMapping("/{camId}/envInfos")
    //    public List<EnvInfoResponseDto> getEnvInfos(@PathVariable Long camId) {
    //        return envInfoService.findAllByCamId(camId);
    //    }
}
