package ssafy.age.backend.share.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ssafy.age.backend.share.service.ShareService;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ShareControllerTest {

    @Mock
    private ShareService shareService;
    @InjectMocks
    private ShareController shareController;

    private MockMvc mockMvc;

    @BeforeEach
    public void initMockMvc() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(shareController)
                .build();
    }


    @Test
    @DisplayName("공유 회원 목록 전체 조회")
    void getAllShares() throws Exception {
        String email = "test@example.com";
        ShareDto shareDto = new ShareDto();
        shareDto.setEmail("shared@example.com");
        shareDto.setNickname("nickname");
        List<ShareDto> shareDtoList = List.of(shareDto);

        given(shareService.getAllShares(email)).willReturn(shareDtoList);

        mockMvc.perform(get("/api/v1/members/{email}/sharedMembers", email))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("shared@example.com"))
                .andExpect(jsonPath("$[0].nickname").value("nickname"));

    }

    @Test
    @DisplayName("공유 회원 추가")
    void createShare() throws Exception {
        String email = "test@example.com";
        ShareDto shareDto = new ShareDto();
        shareDto.setEmail("shared@example.com");
        shareDto.setNickname("nickname");

        given(shareService.createShare(any(String.class), any(String.class), any(String.class))).willReturn(shareDto);

        mockMvc.perform(post("/api/v1/members/{email}/sharedMembers", email)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(shareDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("shared@example.com"))
                .andExpect(jsonPath("$.nickname").value("nickname"));
    }

    @Test
    @DisplayName("공유 회원 수정")
    void updateShare() throws Exception {
        String email = "test@example.com";
        String sharedMemberEmail = "shared@example.com";
        ShareDto inputDto = new ShareDto();
        inputDto.setNickname("new엄마");

        ShareDto returnedDto = new ShareDto();
        returnedDto.setNickname("new엄마");
        returnedDto.setEmail("shared@example.com");

        given(shareService.updateShare(any(String.class), any(String.class), any(String.class))).willReturn(returnedDto);

        mockMvc.perform(patch("/api/v1/members/{email}/sharedMembers/{sharedMemberEmail}", email, sharedMemberEmail)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(inputDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nickname").value("new엄마"))
                .andExpect(jsonPath("$.email").value("shared@example.com"));
    }
    @Test
    @DisplayName("공유 회원 삭제")
    void deleteShare() throws Exception {
        String email = "test@example.com";
        String sharedMemberEmail = "shared@example.com";

        doNothing().when(shareService).deleteShare(any(String.class), any(String.class));

        mockMvc.perform(delete("/api/v1/members/{email}/sharedMembers/{sharedMemberEmail}", email, sharedMemberEmail))
                .andExpect(status().isOk());
    }
}

