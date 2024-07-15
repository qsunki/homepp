package ssafy.age.backend.cam.web;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CamController {

    @GetMapping("/api/v1/cams")
    public String cams() {
        return "";
    }
}
