package nsbm.dea.lms.video.repository;

import nsbm.dea.lms.video.entity.VideoCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VideoCompletionRepository extends JpaRepository<VideoCompletion, Long> {
    Optional<VideoCompletion> findByVideoIdAndStudentId(Long videoId, Long studentId);
}
