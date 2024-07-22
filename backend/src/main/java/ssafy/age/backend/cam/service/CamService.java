package ssafy.age.backend.cam.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.age.backend.cam.exception.CamNotFoundException;
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

    public CamDto updateCam(Long camId, CamDto camDto) {
        Cam cam = camRepository.findById(camId)
                .orElseThrow(CamNotFoundException::new);
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
            throw new CamNotFoundException();
        }
    }
}