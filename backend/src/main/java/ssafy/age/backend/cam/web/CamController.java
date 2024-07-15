package ssafy.age.backend.cam.web;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.age.backend.cam.persistence.Cam;
import ssafy.age.backend.cam.service.CamService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/cams")
public class CamController {

    private final CamService camService;

    @PostMapping
    public ResponseEntity<?> createCam(@RequestBody CamCreateDto camCreateDto) {
        Cam cam = Cam.builder().name(camCreateDto.name).ip(camCreateDto.ip).build();
        Cam saved = camService.saveCam(cam);
        CamResponseDto res = new CamResponseDto(saved.getName(), saved.getIp());
        return ResponseEntity.ok(res);
    }

    @GetMapping
    public ResponseEntity<List<Cam>> getAllCams() {
        return ResponseEntity.ok(camService.getAllCams());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Cam> getCamById(@PathVariable long id) {
        Cam cam = camService.getCamById(id);
        return cam != null ? ResponseEntity.ok(cam) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cam> updateCam(@PathVariable long id, @RequestBody Cam cam) {
    Cam updatedCam = camService.updateCam(id, cam);
    return updatedCam != null ? ResponseEntity.ok(updatedCam) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Cam> deleteCam(@PathVariable long id) {
    camService.deleteCam(id);
    return ResponseEntity.ok(camService.getCamById(id));
    }
}
