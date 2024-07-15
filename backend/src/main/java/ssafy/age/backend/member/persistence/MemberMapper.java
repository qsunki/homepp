package ssafy.age.backend.member.persistence;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface MemberMapper {
    MemberMapper INSTANCE = Mappers.getMapper(MemberMapper.class);

    // MemberRequestDto -> Member mapping
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Member toMember(MemberRequestDto memberRequestDto);
    // Member -> MemberResponseDto
    MemberResponseDto toResponseDto(Member member);
}
