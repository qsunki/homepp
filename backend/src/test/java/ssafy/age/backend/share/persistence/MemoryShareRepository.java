package ssafy.age.backend.share.persistence;

import java.util.*;

public class MemoryShareRepository {
    private final Map<Long, Share> shares = new HashMap<>();
    private Long sequence = 1L;

    public Share save(Share share) {
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

    public List<Share> findAllBySharingMemberEmail(String email) {
        return shares.values().stream()
                .filter(share -> share.getSharingMember().getEmail().equals(email))
                .toList();
    }

    public Optional<Share> findBySharingMemberEmailAndSharedMemberEmail(
            String sharingMemberEmail, String sharedMemberEmail) {
        return shares.values().stream()
                .filter(
                        share ->
                                share.getSharingMember().getEmail().equals(sharingMemberEmail)
                                        && share.getSharedMember()
                                                .getEmail()
                                                .equals(sharedMemberEmail))
                .findFirst();
    }

    public void delete(Share share) {
        shares.remove(share.getId());
    }
}
