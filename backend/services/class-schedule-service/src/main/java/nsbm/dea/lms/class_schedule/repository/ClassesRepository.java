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
    List<Classes> findByCourseIdOrderByPositionAsc(Long courseId);

    List<Classes> findByCourseIdAndStatusOrderByPositionAsc(Long courseId, ClassStatus status);

    List<Classes> findByCourseIdAndStatusAndScheduleOpenTrueOrderByPositionAsc(Long courseId, ClassStatus status);

    Optional<Classes> findTopByCourseIdOrderByPositionDesc(Long courseId);
}
