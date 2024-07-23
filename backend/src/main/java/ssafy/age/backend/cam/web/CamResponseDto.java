package ssafy.age.backend.cam.web;

import lombok.Data;
import ssafy.age.backend.member.persistence.Member;

@Data
public class CamResponseDto {

    private Long camId;
    private String name;
    private String ip;
    private Member member;
}
