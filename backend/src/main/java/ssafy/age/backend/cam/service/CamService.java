package ssafy.age.backend.cam.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.age.backend.cam.exception.CamNotFoundException;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.persistence.CamRepository;
import ssafy.age.backend.cam.web.CamResponseDto;
import ssafy.age.backend.member.persistence.Member;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CamService {

    private final CamRepository camRepository;
    private final CamMapper camMapper = CamMapper.INSTANCE;

    public List<CamResponseDto> getAllCams() {
        List<Cam> camList = camRepository.findAll();
        return camList.stream()
                .map(camMapper::toCamResponseDto)
                .toList();
    }

    public CamResponseDto updateCamName(Long camId, String name) {
        Cam cam = camRepository.findById(camId)
                .orElseThrow(CamNotFoundException::new);
        cam.updateCamName(name);

        return camMapper.toCamResponseDto(camRepository.save(cam));
    }

    public CamResponseDto registerCam(Long camId, Member member) {
        Cam cam = camRepository.findById(camId)
                .orElseThrow(CamNotFoundException::new);
        cam.registerMember(member);

        return camMapper.toCamResponseDto(camRepository.save(cam));
    }

    public CamResponseDto unregisterCam(Long camId) {
        try {
            Cam cam = camRepository.findById(camId)
                    .orElseThrow(CamNotFoundException::new);
            cam.unregisterCam();

            return camMapper.toCamResponseDto(cam);

        } catch (Exception e) {
            throw new CamNotFoundException();
        }
    }
}