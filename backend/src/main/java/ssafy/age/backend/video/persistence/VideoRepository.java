package ssafy.age.backend.video.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface VideoRepository extends JpaRepository<Video, Long> {
    @Query("SELECT DISTINCT v FROM Video v JOIN v.eventList e WHERE e.type = :type AND e.cam.id = :camId AND v.recordStartAt <= :endDate AND v.recordEndAt >= :startDate")
    List<Video> findAllVideos(@Param("type") String type,
                                                     @Param("camId") Long camId,
                                                     @Param("startDate") LocalDateTime startDate,
                                                     @Param("endDate") LocalDateTime endDate);

    @Query("SELECT v FROM Video v JOIN v.eventList e WHERE v.id = :videoId AND e.cam.id = :camId")
    Video findByIdAndCamId(@Param("videoId") Long videoId, @Param("camId") Long camId);
}
