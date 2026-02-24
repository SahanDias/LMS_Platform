package nsbm.dea.lms.class_schedule.repository;

import nsbm.dea.lms.class_schedule.constant.ClassStatus;
import nsbm.dea.lms.class_schedule.entity.Classes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassesRepository extends JpaRepository <Classes, UUID> {
    List<Classes> findByCourseIdOrderByPositionAsc(UUID courseId);

    List<Classes> findByCourseIdAndStatusOrderByPositionAsc(UUID courseId, ClassStatus status);

    List<Classes> findByCourseIdAndStatusAndScheduleOpenTrueOrderByPositionAsc(UUID courseId, ClassStatus status);

    Optional<Classes> findTopByCourseIdOrderByPositionDesc(UUID courseId);
}
