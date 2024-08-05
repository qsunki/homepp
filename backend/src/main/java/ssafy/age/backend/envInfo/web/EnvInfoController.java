package ssafy.age.backend.envInfo.web;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import ssafy.age.backend.envInfo.service.EnvInfoService;

@RestController
@RequiredArgsConstructor
public class EnvInfoController {
    private final EnvInfoService envInfoService;

    @GetMapping("/api/v1/cams/{camId}/envInfos")
    public List<EnvInfoResponseDto> getEnvInfos(@PathVariable Long camId) {
        return envInfoService.getEnvInfos(camId);
    }

    @GetMapping("/api/v1/cams/{camId}/envInfo")
    public EnvInfoResponseDto getEnvInfo(@PathVariable Long camId) {
        return envInfoService.getEnvInfo(camId);
    }
}
