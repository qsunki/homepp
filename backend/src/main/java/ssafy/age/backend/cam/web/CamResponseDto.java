package ssafy.age.backend.cam.web;

import lombok.Data;
import ssafy.age.backend.member.persistence.Member;

@Data
public class CamResponseDto {
    private Long id;//TODO: camId
    private String name;
    private Member member;
}
