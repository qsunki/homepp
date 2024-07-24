package ssafy.age.backend.share.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ShareRepository extends JpaRepository<Share, Long> {
    Share findBySharedMemberIdEmail(String email);
}
