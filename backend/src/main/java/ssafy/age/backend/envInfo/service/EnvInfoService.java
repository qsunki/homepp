package ssafy.age.backend.envInfo.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.age.backend.cam.exception.CamNotFoundException;
import ssafy.age.backend.cam.persistence.CamRepository;
import ssafy.age.backend.envInfo.persistence.EnvInfo;
import ssafy.age.backend.envInfo.persistence.EnvInfoRepository;
import ssafy.age.backend.envInfo.web.EnvInfoReceivedDto;
import ssafy.age.backend.envInfo.web.EnvInfoResponseDto;

@Service
@RequiredArgsConstructor
public class EnvInfoService {

    private final EnvInfoMapper envInfoMapper = EnvInfoMapper.INSTANCE;
    private final EnvInfoRepository envInfoRepository;
    private final CamRepository camRepository;

    public void save(EnvInfoReceivedDto envInfoReceivedDto) {
        EnvInfo envInfo = envInfoMapper.toEnvInfo(envInfoReceivedDto);
        envInfoRepository.save(envInfo);
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
        List<EnvInfo> envInfos = envInfoRepository.findAllByCamId(camId);

        EnvInfo latestEnvInfo = envInfos.getLast();
        return envInfoMapper.toEnvInfoResponseDto(latestEnvInfo);
    }
}
