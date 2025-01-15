package ssafy.age.backend.member.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import ssafy.age.backend.member.persistence.Member;
import ssafy.age.backend.member.persistence.MemoryMemberRepository;
import ssafy.age.backend.member.web.MemberResponseDto;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    MemoryMemberRepository fakeMemberRepository = new MemoryMemberRepository();

    MemberService memberService;

    @BeforeEach
    void setUp() {
        memberService = new MemberService(fakeMemberRepository, passwordEncoder);
    }

    @DisplayName("비밀번호와 전화번호를 업데이트 할 수 있다.")
    @Test
    void updateMember() {
        // given
        Member member = new Member("test@example.com", "testpassword", "010-0000-0000");
        fakeMemberRepository.save(member);
        String updatedPassword = "updatedPassword";
        String updatedPhoneNumber = "010-0000-0001";

        // when
        MemberResponseDto memberResponseDto =
                memberService.updateMember(updatedPassword, updatedPhoneNumber, member.getId());

        // then
        assertThat(memberResponseDto.email()).isEqualTo(member.getEmail());
        assertThat(memberResponseDto.phoneNumber()).isEqualTo(updatedPhoneNumber);
        assertThat(passwordEncoder.matches(updatedPassword, member.getPassword()))
                .isTrue();
        assertThat(member.getPhoneNumber()).isEqualTo(updatedPhoneNumber);
    }

    @DisplayName("회원을 삭제하여 탈퇴처리 할 수 있다.")
    @Test
    void deleteMember() {
        // given
        Member member = new Member("test@example.com", "testpassword", "010-0000-0000");
        fakeMemberRepository.save(member);

        // when
        memberService.deleteMember(member.getId());

        // then
        assertThat(fakeMemberRepository.findById(member.getId())).isEmpty();
    }
}
