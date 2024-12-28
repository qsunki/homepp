package ssafy.age.backend.member.persistence;

import java.time.LocalDateTime;

public class MemberStub extends Member {

    public MemberStub(
            Long id, String email, String password, LocalDateTime createdAt, String phoneNumber) {
        super(email, password, createdAt, phoneNumber);
        setId(id);
    }
}
