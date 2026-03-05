package progress.service.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import progress.service.entity.Course;

public interface CourseRepo extends JpaRepository<Course,Integer> {

}
