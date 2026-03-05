package nsbm.dea.lms.video.repository;

import nsbm.dea.lms.video.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByClassIdAndIsActiveTrue(Long classId);
    List<Video> findByClassId(Long classId);
}
