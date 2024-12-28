package ssafy.age.backend.member.web;

import lombok.Data;

@Data
public class MemberResponseDto {
    private String email;
    private String phoneNumber;

    public MemberResponseDto(String email, String phoneNumber) {
        this.email = email;
        this.phoneNumber = phoneNumber;
    }
}
