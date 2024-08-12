package ssafy.age.backend.threat.web;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.auth.service.AuthService;
import ssafy.age.backend.threat.service.ThreatService;

@Slf4j
@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
public class ThreatController {

    private final ThreatService threatService;

    @GetMapping("/threats")
    public List<ThreatResponseDto> getThreats() {
        return threatService.getAllThreats();
    }

    @GetMapping("/{email}/threats")
    public List<ThreatResponseDto> getThreats(@PathVariable String email) {
        return threatService.getThreatsByMember(email);
    }

    @PatchMapping("/{email}/threats/{threatId}")
    public void readThreat(@PathVariable String email, @PathVariable Long threatId) {
        threatService.readThreat(threatId);
    }

    @DeleteMapping("/{email}/threats/{threatId}")
    public void deleteThreat(@PathVariable String email, @PathVariable Long threatId) {
        threatService.deleteThreat(threatId);
    }
}
