package ssafy.age.backend.member.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.web.MemberRequestDto;
import ssafy.age.backend.member.web.MemberResponseDto;

@Mapper
public interface MemberMapper {
    MemberMapper INSTANCE = Mappers.getMapper(MemberMapper.class);

    // MemberRequestDto -> MemberDto mapping
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "roles", ignore = true)
    MemberDto toMemberDto(MemberRequestDto memberRequestDto);

    // MemberDto -> Member mapping
    Member toMember(MemberDto memberDto);

    // Member -> MemberDto mapping
    MemberDto toMemberDto(Member member);

    // MemberDto -> MemberResponseDto
    MemberResponseDto toResponseDto(MemberDto memberDto);
}
