package nsbm.dea.lms.progress_service.repository;

import nsbm.dea.lms.progress_service.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepo extends JpaRepository<Course ,Long> {

}
