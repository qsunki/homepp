package ssafy.age.backend.member.persistence;

public class MemberStub extends Member {

    public MemberStub(Long id, String email, String password, String phoneNumber) {
        super(email, password, phoneNumber);
        setId(id);
    }
}
