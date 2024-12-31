package ssafy.age.backend.share.web;

import lombok.Data;

@Data
public class ShareDto {

    private String email;
    private String nickname;

    public ShareDto() {}

    public ShareDto(String email, String nickname) {
        this.email = email;
        this.nickname = nickname;
    }
}
