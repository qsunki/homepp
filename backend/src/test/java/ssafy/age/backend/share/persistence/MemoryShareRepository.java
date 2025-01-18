package ssafy.age.backend.share.persistence;

import java.util.*;
import ssafy.age.backend.testutils.MemoryJpaRepository;

public class MemoryShareRepository extends MemoryJpaRepository<Share> implements ShareRepository {

    public MemoryShareRepository() {
        super(Share::setId, Share::getId);
    }

    @Override
    public List<Share> findAllBySharingMemberEmail(String email) {
        return store.values().stream()
                .filter(share -> share.getSharingMember().getEmail().equals(email))
                .toList();
    }

    @Override
    public Share findBySharingMemberEmailAndSharedMemberEmail(String sharingMemberEmail, String sharedMemberEmail) {
        return store.values().stream()
                .filter(share -> share.getSharingMember().getEmail().equals(sharingMemberEmail)
                        && share.getSharedMember().getEmail().equals(sharedMemberEmail))
                .findFirst()
                .orElseThrow();
    }
}
