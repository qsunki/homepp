package ssafy.age.backend.envInfo.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ssafy.age.backend.cam.exception.CamNotFoundException;
import ssafy.age.backend.cam.persistence.CamRepository;
import ssafy.age.backend.envInfo.exception.EnvInfoNotFoundException;
import ssafy.age.backend.envInfo.persistence.EnvInfo;
import ssafy.age.backend.envInfo.persistence.EnvInfoRepository;
import ssafy.age.backend.envInfo.web.EnvInfoReceivedDto;
import ssafy.age.backend.envInfo.web.EnvInfoResponseDto;
import ssafy.age.backend.envInfo.web.RecordStatusDto;
import ssafy.age.backend.notification.service.FCMService;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnvInfoService {

    private final EnvInfoMapper envInfoMapper = EnvInfoMapper.INSTANCE;
    private final EnvInfoRepository envInfoRepository;
    private final CamRepository camRepository;
    private final FCMService fcmService;

    public void save(EnvInfoReceivedDto envInfoReceivedDto) {
        EnvInfo envInfo = envInfoMapper.toEnvInfo(envInfoReceivedDto);
        log.debug("Saving envInfoReceivedDto: {}", envInfoReceivedDto);
        log.debug("Saving envInfo.cam.id: {}", envInfo.getCam().getId());
        envInfoRepository.save(envInfo);
    }

    public void updateStatus(RecordStatusDto recordStatusDto) {
        EnvInfo envInfo =
                envInfoRepository
                        .findLatestByCamId(recordStatusDto.getCamId())
                        .orElseThrow(EnvInfoNotFoundException::new);
        envInfo.setStatus(recordStatusDto.getStatus());
        envInfoRepository.save(envInfo);
        fcmService.sendOnOffMessage(
                String.valueOf(recordStatusDto.getStatus()), recordStatusDto.getCamId());
    }

    public List<EnvInfoResponseDto> getEnvInfos(Long camId) {
        if (!camRepository.existsById(camId)) {
            throw new CamNotFoundException();
        }
        List<EnvInfo> envInfos = envInfoRepository.findAllByCamId(camId);
        return envInfos.stream().map(envInfoMapper::toEnvInfoResponseDto).toList();
    }

    public EnvInfoResponseDto getEnvInfo(Long camId) {
        if (!camRepository.existsById(camId)) {
            throw new CamNotFoundException();
        }

        return envInfoMapper.toEnvInfoResponseDto(
                envInfoRepository
                        .findLatestByCamId(camId)
                        .orElseThrow(EnvInfoNotFoundException::new));
    }
}
