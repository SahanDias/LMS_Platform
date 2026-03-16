package nsbm.dea.lms.enrollment.repository;

import nsbm.dea.lms.enrollment.entity.Enrollment;
import nsbm.dea.lms.enrollment.entity.enums.EnrollmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    Page<Enrollment> findByStudentId(Long studentId, Pageable pageable);

    Page<Enrollment> findByCourseId(Long courseId, Pageable pageable);

    long countByClassIdAndStatusIn(String classId, Iterable<EnrollmentStatus> statuses);
}

