package ssafy.age.backend.member.web;

import jakarta.validation.constraints.*;

public record MemberJoinRequestDto(
        @NotNull @Email String email,
        @NotNull @Size(min = 8, max = 20) String password,
        @NotNull @Pattern(regexp = "^010-\\d{4}-\\d{4}$", message = "Phone number must be in the format 010-1234-5678")
                String phoneNumber) {}
