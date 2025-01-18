package ssafy.age.backend.testutil;

import ssafy.age.backend.member.persistence.Member;

public class MemberFixture {
    public static Member memberOne() {
        return new Member("user1@example.com", "user1password", "000-0000-0001");
    }

    public static Member memberTwo() {
        return new Member("user2@example.com", "user2password", "000-0000-0002");
    }
}
