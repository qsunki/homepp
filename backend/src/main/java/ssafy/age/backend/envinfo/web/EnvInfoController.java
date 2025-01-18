package ssafy.age.backend.envinfo.web;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import ssafy.age.backend.cam.service.CamService;
import ssafy.age.backend.envinfo.service.EnvInfoService;
import ssafy.age.backend.security.service.MemberInfoDto;

@RestController
@RequiredArgsConstructor
public class EnvInfoController {
    private final EnvInfoService envInfoService;
    private final CamService camService;

    @GetMapping("/api/v1/cams/{camId}/envInfos")
    public List<EnvInfoResponseDto> getEnvInfos(
            @PathVariable Long camId, @AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        camService.validateCamOwnership(camId, memberInfoDto.memberId());
        return envInfoService.getEnvInfos(camId);
    }

    @GetMapping("/api/v1/cams/{camId}/envInfo")
    public EnvInfoResponseDto getEnvInfo(
            @PathVariable Long camId, @AuthenticationPrincipal MemberInfoDto memberInfoDto) {
        camService.validateCamOwnership(camId, memberInfoDto.memberId());
        return envInfoService.getEnvInfo(camId);
    }
}
