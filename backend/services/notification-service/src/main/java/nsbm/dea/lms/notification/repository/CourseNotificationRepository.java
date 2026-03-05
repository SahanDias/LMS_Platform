package nsbm.dea.lms.notification.repository;

import nsbm.dea.lms.notification.entity.CourseNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface CourseNotificationRepository extends JpaRepository<CourseNotification, Long> {

    boolean existsByCourseNameAndStudentNameAndCompletedDate(
            String courseName,
            String studentName,
            LocalDate completedDate
    );
}

