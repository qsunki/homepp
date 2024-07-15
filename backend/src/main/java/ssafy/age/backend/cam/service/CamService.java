package ssafy.age.backend.cam.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.age.backend.cam.persistence.CamRepository;

@Service
@RequiredArgsConstructor
public class CamService {
    private final CamRepository camRepository;
}
