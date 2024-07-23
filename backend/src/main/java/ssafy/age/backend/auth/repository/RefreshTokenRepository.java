package ssafy.age.backend.auth.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ssafy.age.backend.auth.persistence.RefreshToken;

@Repository
//TODO: @Repository 필요없음ㄷ + 패키지에 수정할 것
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
}
