package ssafy.age.backend.member.web;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import ssafy.age.backend.member.service.MemberService;
import ssafy.age.backend.security.TestSecurityConfig;
import ssafy.age.backend.security.service.AuthService;

@WebMvcTest(MemberController.class)
@Import(TestSecurityConfig.class)
class MemberControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockitoBean MemberService memberService;
    @MockitoBean AuthService authService;

    @DisplayName("비회원이 회원가입할 수 있다.")
    @Test
    void joinMember() throws Exception {
        // given
        String email = "test@example.com";
        String password = "1234";
        String phoneNumber = "010-0000-0000";
        MemberRequestDto requestDto = new MemberRequestDto(email, password, phoneNumber);
        MemberResponseDto responseDto = new MemberResponseDto(email, phoneNumber);
        String request = objectMapper.writeValueAsString(requestDto);
        String response = objectMapper.writeValueAsString(responseDto);
        given(authService.joinMember(email, password, phoneNumber)).willReturn(responseDto);

        // when & then
        mockMvc.perform(
                        post("/api/v1/members")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(request))
                .andExpect(status().isOk())
                .andExpect(content().json(response))
                .andDo(print());
    }
}
