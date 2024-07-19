package ssafy.age.backend.cam.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.persistence.CamRepository;
import ssafy.age.backend.cam.web.CamResponseDto;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CamService {

    private final CamRepository camRepository;
    private final CamMapper camMapper;

    public List<CamDto> getAllCams() {
        List<Cam> camList = camRepository.findAll();
        return camList.stream()
                .map(camMapper::toCamDto)
                .toList();
    }

    public CamDto addCam(CamDto camDto) {
        Cam cam = camMapper.toCam(camDto);
        return camMapper.toCamDto(camRepository.save(cam));
    }

}