package ssafy.age.backend.cam.web;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import ssafy.age.backend.cam.service.CamService;
import ssafy.age.backend.security.TestSecurityConfig;
import ssafy.age.backend.security.service.MemberInfoDto;

@WebMvcTest(CamController.class)
@Import(TestSecurityConfig.class)
class CamControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockitoBean CamService camService;

    @DisplayName("인증된 사용자가 캠 목록을 가져올 수 있다.")
    @Test
    void getCams() throws Exception {
        // given
        MemberInfoDto memberInfoDto = new MemberInfoDto(1L, "test@example.com");
        CamResponseDto camResponseDto1 = new CamResponseDto(1L, "living room", "living room url");
        CamResponseDto camResponseDto2 = new CamResponseDto(2L, "kitchen", "kitchen url");
        CamResponseDto camResponseDto3 = new CamResponseDto(3L, "bathroom", "bathroom url");
        List<CamResponseDto> camResponseDtos =
                List.of(camResponseDto1, camResponseDto2, camResponseDto3);
        given(camService.getCams(memberInfoDto.getMemberId())).willReturn(camResponseDtos);

        UsernamePasswordAuthenticationToken authentication =
                UsernamePasswordAuthenticationToken.authenticated(memberInfoDto, null, List.of());
        String response = objectMapper.writeValueAsString(camResponseDtos);

        // when & then
        mockMvc.perform(
                        get("/api/v1/cams")
                                .with(authentication(authentication))
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json(response))
                .andDo(print());
    }

    @DisplayName("인증되지 않은 사용자는 캠 목록을 불러올 수 없다.")
    @Test
    void getCamsWithNoSession() throws Exception {
        // when & then
        mockMvc.perform(get("/api/v1/cams").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andDo(print());
    }

    @DisplayName("이메일 정보를 받아 캠 생성을 할 수 있다.")
    @Test
    void createCam() throws Exception {
        // given
        String email = "test@example.com";
        String clientIP = "0.0.0.0";
        CamCreateRequestDto requestDto = new CamCreateRequestDto(email);
        CamResponseDto responseDto = new CamResponseDto(1L, "living room", "living room url");
        String request = objectMapper.writeValueAsString(requestDto);
        String response = objectMapper.writeValueAsString(responseDto);
        given(camService.createCam(anyString(), anyString())).willReturn(responseDto);

        // when & then
        mockMvc.perform(
                        post("/api/v1/cams")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(request)
                                .header("X-Forwarded-For", clientIP))
                .andExpect(status().isOk())
                .andExpect(content().json(response))
                .andDo(print());
    }
}
