package nsbm.dea.lms.enrollment.repository;

import nsbm.dea.lms.enrollment.entity.WaitlistEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WaitlistRepository extends JpaRepository<WaitlistEntry, Long> {

    List<WaitlistEntry> findByStudentId(Long studentId);

    Optional<WaitlistEntry> findFirstByClassIdOrderByPositionAsc(String classId);

    int countByClassId(String classId);
}

