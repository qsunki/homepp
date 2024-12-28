package ssafy.age.backend.member.web;

import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
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
import ssafy.age.backend.member.service.MemberService;
import ssafy.age.backend.security.TestSecurityConfig;
import ssafy.age.backend.security.service.AuthService;
import ssafy.age.backend.security.service.MemberInfoDto;

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
        MemberJoinRequestDto requestDto = new MemberJoinRequestDto(email, password, phoneNumber);
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

    @DisplayName("로그인한 사용자는 자신의 회원정보(비밀번호, 전화번호)를 수정할 수 있다.")
    @Test
    void updateMember() throws Exception {
        // given
        long memberId = 1L;
        String email = "current@example.com";
        String updatedPassword = "1234";
        String updatedPhoneNumber = "010-1111-1111";
        MemberUpdateRequestDto requestDto =
                new MemberUpdateRequestDto(updatedPassword, updatedPhoneNumber);
        MemberResponseDto responseDto = new MemberResponseDto(email, updatedPhoneNumber);
        String request = objectMapper.writeValueAsString(requestDto);
        String response = objectMapper.writeValueAsString(responseDto);
        given(memberService.updateMember(updatedPassword, updatedPhoneNumber, memberId))
                .willReturn(responseDto);

        UsernamePasswordAuthenticationToken authentication =
                UsernamePasswordAuthenticationToken.authenticated(
                        new MemberInfoDto(memberId, email), null, List.of());

        // when & then
        mockMvc.perform(
                        patch("/api/v1/members")
                                .with(authentication(authentication))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(request))
                .andExpect(status().isOk())
                .andExpect(content().json(response))
                .andDo(print());
    }
}
