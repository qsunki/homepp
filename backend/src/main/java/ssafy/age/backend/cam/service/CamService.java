package ssafy.age.backend.cam.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.persistence.CamRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CamService {
    private final CamRepository camRepository;

    public Cam saveCam(Cam cam) {
        Cam save = camRepository.save(cam);
        return save;
    }

    public List<Cam> getAllCams() {
        return camRepository.findAll();
    }

    public Cam getCamById(Long id) {
        return camRepository.findById(id).orElse(null);
    }

    public void deleteCam(Long id) {
        camRepository.deleteById(id);
    }


    public Cam updateCam(long id, Cam camDetails) {
        Cam cam = camRepository.findById(id).orElse(null);
        if (cam != null) {
            cam.setName(camDetails.getName());
            cam.setIp(camDetails.getIp());
            cam.setStatus(camDetails.getStatus());
            camRepository.save(cam);
        }
        return cam;
    }
}