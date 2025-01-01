package ssafy.age.backend.envinfo.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ssafy.age.backend.cam.exception.CamNotFoundException;
import ssafy.age.backend.cam.persistence.CamRepository;
import ssafy.age.backend.cam.service.CamService;
import ssafy.age.backend.envinfo.exception.EnvInfoNotFoundException;
import ssafy.age.backend.envinfo.persistence.EnvInfo;
import ssafy.age.backend.envinfo.persistence.EnvInfoRepository;
import ssafy.age.backend.envinfo.web.EnvInfoReceivedDto;
import ssafy.age.backend.envinfo.web.EnvInfoResponseDto;
import ssafy.age.backend.envinfo.web.RecordStatusDto;
import ssafy.age.backend.notification.service.FCMService;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnvInfoService {

    private static final EnvInfoMapper envInfoMapper = EnvInfoMapper.INSTANCE;

    private final EnvInfoRepository envInfoRepository;
    private final CamRepository camRepository;
    private final CamService camService;
    private final FCMService fcmService;

    public void save(EnvInfoReceivedDto envInfoReceivedDto) {
        EnvInfo envInfo =
                new EnvInfo(
                        envInfoReceivedDto.getRecordedAt(),
                        envInfoReceivedDto.getTemperature(),
                        envInfoReceivedDto.getHumidity(),
                        envInfoReceivedDto.getStatus(),
                        camRepository.getReferenceById(envInfoReceivedDto.getCamId()));
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
        List<EnvInfo> envInfos = envInfoRepository.findAllByCamId(camId);
        return envInfos.stream().map(envInfoMapper::toEnvInfoResponseDto).toList();
    }

    public EnvInfoResponseDto getEnvInfo(Long camId, Long memberId) {
        camService.verifyMemberByCamId(camId, memberId);
        if (!camRepository.existsById(camId)) {
            throw new CamNotFoundException();
        }

        return envInfoMapper.toEnvInfoResponseDto(
                envInfoRepository
                        .findLatestByCamId(camId)
                        .orElseThrow(EnvInfoNotFoundException::new));
    }
}
