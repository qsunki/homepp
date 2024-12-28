package ssafy.age.backend.member.web;

import jakarta.validation.constraints.NotBlank;

public record MemberJoinRequestDto(
        @NotBlank String email, @NotBlank String password, @NotBlank String phoneNumber) {}
