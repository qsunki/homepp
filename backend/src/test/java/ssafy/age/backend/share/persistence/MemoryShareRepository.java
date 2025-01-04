package ssafy.age.backend.share.persistence;

import java.util.*;
import org.springframework.lang.NonNull;
import ssafy.age.backend.NotJpaRepository;

public class MemoryShareRepository implements ShareRepository, NotJpaRepository<Share> {
    private final Map<Long, Share> shares = new HashMap<>();
    private Long sequence = 1L;

    @Override
    @NonNull public <S extends Share> S save(S share) {
        if (share.getId() != null) {
            shares.put(share.getId(), share);
            return share;
        }
        while (shares.containsKey(sequence)) {
            sequence++;
        }
        share.setId(sequence);
        shares.put(sequence, share);
        return share;
    }

    @Override
    public List<Share> findAllBySharingMemberEmail(String email) {
        return shares.values().stream()
                .filter(share -> share.getSharingMember().getEmail().equals(email))
                .toList();
    }

    @Override
    public Share findBySharingMemberEmailAndSharedMemberEmail(
            String sharingMemberEmail, String sharedMemberEmail) {
        return shares.values().stream()
                .filter(
                        share ->
                                share.getSharingMember().getEmail().equals(sharingMemberEmail)
                                        && share.getSharedMember()
                                                .getEmail()
                                                .equals(sharedMemberEmail))
                .findFirst()
                .orElseThrow();
    }

    @Override
    public void delete(Share share) {
        shares.remove(share.getId());
    }
}
