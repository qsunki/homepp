package ssafy.age.backend.cam.web;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ssafy.age.backend.cam.service.CamService;
import ssafy.age.backend.security.service.MemberInfoDto;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/cams")
public class CamController {

    private final CamService camService;

    @GetMapping
    @Operation(summary = "캠 목록 조회", description = "로그인 된 멤버의 모든 캠 목록 조회")
    public List<CamResponseDto> getCams(@AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        return camService.getCams(memberInfoDto.getMemberId());
    }

    @GetMapping("/shared")
    public List<CamResponseDto> getCamsShared(
            @AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        return camService.getCamsBySharedEmail(memberInfoDto.getMemberId());
    }

    @PostMapping
    @Operation(summary = "캠 등록", description = "디바이스에서 요청을 보내서 캠 초기등록")
    public CamResponseDto createCam(
            @RequestBody Map<String, String> map,
            HttpServletRequest request,
            @AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null) ip = request.getRemoteAddr();
        return camService.createCam(map.get("email"), ip);
    }

    @GetMapping("/{camId}")
    @Operation(summary = "캠 조회", description = "캠 id를 통해서 정보 조회")
    public CamResponseDto findCamById(
            @PathVariable Long camId, @AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        return camService.findCamById(camId, memberInfoDto.getMemberId());
    }

    @CrossOrigin
    @PatchMapping("/{camId}")
    @Operation(summary = "캠 이름 수정", description = "캠 아이디에 따른 캠 이름 수정")
    public CamResponseDto updateCam(
            @PathVariable Long camId,
            @RequestBody CamRequestDto camRequestDto,
            @AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        return camService.updateCamName(
                camId, memberInfoDto.getMemberId(), camRequestDto.getName());
    }

    @DeleteMapping("/{camId}")
    @Operation(summary = "캠 삭제", description = "캠 아이디에 따른 캠 삭제")
    public void deleteCam(
            @PathVariable Long camId, @AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        camService.deleteCam(camId, memberInfoDto.getMemberId());
    }

    @PostMapping("/{camId}/stream")
    public StreamResponseDto streamCam(
            @PathVariable Long camId,
            @RequestBody StreamRequestDto requestDto) {
        return camService.streamControl(
                camId, requestDto.getKey(), requestDto.getCommand());
    }

    @GetMapping("/{camId}/thumbnail")
    @Operation(summary = "캠 실시간 썸네일 조회", description = "캠 id를 통해서 썸네일 조회")
    public ResponseEntity<Resource> getCamThumbnail(@PathVariable Long camId) {
        Resource thumbnail = camService.getCamThumbnail(camId);
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(thumbnail);
    }

    @PostMapping("/{camId}/thumbnail")
    public void thumbnailOnServer(
            @PathVariable Long camId,
            @RequestPart MultipartFile file,
            @AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        camService.saveCamThumbnail(camId, memberInfoDto.getMemberId(), file);
    }

    @PostMapping("/{camId}/control")
    public void controlDetection(
            @PathVariable Long camId,
            @RequestBody ControlRequestDto controlRequestDto,
            @AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        camService.controlDetection(
                camId, memberInfoDto.getMemberId(), controlRequestDto.getCommand());
    }
}
