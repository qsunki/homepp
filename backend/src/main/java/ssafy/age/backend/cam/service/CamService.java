package ssafy.age.backend.cam.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.persistence.CamRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CamService {

    private final CamRepository camRepository;
    private final CamMapper camMapper = CamMapper.INSTANCE;

    public List<CamDto> getAllCams() {
        List<Cam> camList = camRepository.findAll();
        return camList.stream()
                .map(camMapper::toCamDto)
                .toList();
    }

    public CamDto createCam() {
        Cam saved = camRepository.save(Cam.builder().build());
        return camMapper.toCamDto(saved);
    }

    public CamDto updateCam(Long camId, CamDto camDto) {
        Cam cam = camRepository.findById(camId)
                .orElseThrow(RuntimeException::new);
        cam.updateCam(camDto.getName(),
                      camDto.getIp(),
                      camDto.getStatus(),
                      camDto.getHomeId());
        return camMapper.toCamDto(camRepository.save(cam));
    }

    public void deleteCam(Long camId) {
        try {
            camRepository.deleteById(camId);
        } catch (Exception e) {
            throw new RuntimeException("캠 삭제 시 오류 발생");
        }
    }
}