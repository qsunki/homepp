package ssafy.age.backend.envInfo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.envInfo.persistence.EnvInfo;
import ssafy.age.backend.envInfo.persistence.EnvInfoMapper;
import ssafy.age.backend.envInfo.persistence.EnvInfoRepository;

@Service
@RequiredArgsConstructor
public class EnvInfoService {

    private final EnvInfoMapper envInfoMapper = EnvInfoMapper.INSTANCE;
    private final EnvInfoRepository envInfoRepository;

    public void save(EnvInfoDto envInfoDto) {
        EnvInfo envInfo = envInfoMapper.toEnvInfo(envInfoDto);
        envInfo.setCam(Cam.builder().id(envInfoDto.getCamId()).build());
        envInfoRepository.save(envInfo);
    }
    //
    //    public List<EnvInfoResponseDto> findAllByCamId(Long camId) {
    //        List<EnvInfo> envInfos = envInfoRepository.findByCamId(camId);
    //        return envInfos.stream()
    //                .map(envInfoMapper::toEnvInfoResponseDto)
    //                .collect(Collectors.toList());
    //    }
}
