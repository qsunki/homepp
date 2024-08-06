package ssafy.age.backend.threat.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ssafy.age.backend.threat.exception.ThreatNotFoundException;
import ssafy.age.backend.threat.persistence.Threat;
import ssafy.age.backend.threat.persistence.ThreatRepository;
import ssafy.age.backend.threat.web.ThreatResponseDto;

@Service
@RequiredArgsConstructor
@Slf4j
public class ThreatService {

    private final ThreatRepository threatRepository;
    private final ThreatMapper threatMapper = ThreatMapper.INSTANCE;

    public List<ThreatResponseDto> getThreatsByMember(String email) {
        List<Threat> threats = threatRepository.findAllByMemberEmail(email);
        return threats.stream().map(threatMapper::toThreatResponseDto).toList();
    }

    public void readThreat(Long threatId) {
        Threat threat =
                threatRepository.findById(threatId).orElseThrow(ThreatNotFoundException::new);
        threat.read();
    }

    public void deleteThreat(Long threatId) {
        threatRepository.deleteById(threatId);
    }
}
