package ssafy.age.backend.share.web;

import static org.mockito.BDDMockito.given;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import ssafy.age.backend.security.TestSecurityConfig;
import ssafy.age.backend.security.service.MemberInfoDto;
import ssafy.age.backend.share.service.ShareService;

@WebMvcTest(ShareController.class)
@Import(TestSecurityConfig.class)
class ShareControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockitoBean ShareService shareService;

    @DisplayName("인증된 사용자는 공유 회원 목록을 조회할 수 있다.")
    @Test
    void getAllShares() throws Exception {
        // given
        MemberInfoDto memberInfoDto = new MemberInfoDto(1L, "test@example.com");
        ShareDto shareDto1 = new ShareDto("mother@example.com", "mother");
        ShareDto shareDto2 = new ShareDto("father@example.com", "father");
        List<ShareDto> shareDtos = List.of(shareDto1, shareDto2);
        given(shareService.getAllShares(memberInfoDto.getEmail())).willReturn(shareDtos);

        UsernamePasswordAuthenticationToken authentication =
                UsernamePasswordAuthenticationToken.authenticated(memberInfoDto, null, List.of());
        String response = objectMapper.writeValueAsString(shareDtos);

        // when & then
        mockMvc.perform(
                        get("/api/v1/shared-members")
                                .with(authentication(authentication))
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json(response))
                .andDo(print());
    }

    @Test
    @DisplayName("인증된 사용자는 공유 회원을 추가할 수 있다.")
    void createShare() throws Exception {
        // given
        MemberInfoDto memberInfoDto = new MemberInfoDto(1L, "test@example.com");
        ShareDto shareDto = new ShareDto("sharedMember@example.com", "shared");
        given(
                        shareService.createShare(
                                memberInfoDto.getEmail(), "sharedMember@example.com", "shared"))
                .willReturn(shareDto);

        UsernamePasswordAuthenticationToken authentication =
                UsernamePasswordAuthenticationToken.authenticated(memberInfoDto, null, List.of());
        String response = objectMapper.writeValueAsString(shareDto);

        // when & then
        mockMvc.perform(
                        post("/api/v1/shared-members")
                                .with(authentication(authentication))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(shareDto)))
                .andExpect(status().isOk())
                .andExpect(content().json(response))
                .andDo(print());
    }

    @Test
    @DisplayName("인증된 사용자는 공유 회원 닉네임을 수정할 수 있다.")
    void updateShare() throws Exception {
        // given
        MemberInfoDto memberInfoDto = new MemberInfoDto(1L, "test@example.com");
        ShareDto shareDto = new ShareDto("sharedMember@example.com", "shared");
        given(
                        shareService.updateShare(
                                memberInfoDto.getEmail(), "sharedMember@example.com", "shared"))
                .willReturn(shareDto);

        UsernamePasswordAuthenticationToken authentication =
                UsernamePasswordAuthenticationToken.authenticated(memberInfoDto, null, List.of());
        String response = objectMapper.writeValueAsString(shareDto);

        // when & then
        mockMvc.perform(
                        patch(
                                        "/api/v1/shared-members/{sharedMemberEmail}",
                                        "sharedMember@example.com")
                                .with(authentication(authentication))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(shareDto)))
                .andExpect(status().isOk())
                .andExpect(content().json(response))
                .andDo(print());
    }

    @Test
    @DisplayName("공유 회원 삭제")
    void deleteShare() throws Exception {
        // given
        MemberInfoDto memberInfoDto = new MemberInfoDto(1L, "test@example.com");

        UsernamePasswordAuthenticationToken authentication =
                UsernamePasswordAuthenticationToken.authenticated(memberInfoDto, null, List.of());

        // when & then
        mockMvc.perform(
                        delete(
                                        "/api/v1/shared-members/{sharedMemberEmail}",
                                        "sharedMember@example.com")
                                .with(authentication(authentication))
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(print());
    }
}
