package ssafy.age.backend.member.service;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.web.MemberResponseDto;

@Mapper
public interface MemberMapper {
    MemberMapper INSTANCE = Mappers.getMapper(MemberMapper.class);

    MemberResponseDto toMemberResponseDto(Member member);
}
