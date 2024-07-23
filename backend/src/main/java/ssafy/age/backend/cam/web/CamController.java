package ssafy.age.backend.cam.web;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.service.CamDto;
import ssafy.age.backend.cam.service.CamMapper;
import ssafy.age.backend.cam.service.CamService;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/cams")
public class CamController {

    private final CamService camService;
    private final CamMapper camMapper = CamMapper.INSTANCE;

    @GetMapping
    public List<CamResponseDto> getAllCams() {
        List<CamDto> camDtoList = camService.getAllCams();
        return camDtoList.stream()
                .map(camMapper::toCamResponseDto)
                .toList();
    }

    @PostMapping
    public CamResponseDto createCam() {
        return camMapper.toCamResponseDto(camService.createCam());
    }

    @PatchMapping("/{camId}")//TODO: 이름바꾸기 + 사용자가 등록하기
    public CamResponseDto updateCam(@PathVariable Long camId, @RequestBody CamRequestDto camRequestDto) {
        //TODO: 예시 참고 후 재작성 
        //예시
        if (camRequestDto.getStatus() == null) {
            //이름만바꾸는 서비스 호출
        } else {
            //캠 사용자 등록
        }
        CamDto camDto = camMapper.toCamDto(camRequestDto);
        return camMapper.toCamResponseDto(camService.updateCam(camId, camDto));
    }

    @DeleteMapping("/{camId}")
    public void deleteCam(@PathVariable Long camId) {
        camService.deleteCam(camId);
    }

}
