package ssafy.age.backend.cam.web;

import lombok.Data;
import ssafy.age.backend.cam.persistence.CamStatus;
import ssafy.age.backend.member.persistence.Member;

@Data
public class CamRequestDto {
    private String name;
    private String ip;
    private CamStatus status;
    private Member member;
}
