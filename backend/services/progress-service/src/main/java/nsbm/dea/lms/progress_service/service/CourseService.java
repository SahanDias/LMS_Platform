package nsbm.dea.lms.progress_service.service;

import nsbm.dea.lms.progress_service.dto.CourseDTO;
import nsbm.dea.lms.progress_service.entity.Course;

import java.util.List;
import java.util.Optional;

public interface CourseService {
      List<Course> getAllCourse();
      String saveCourse(CourseDTO courseDTO);
      String updateCourse(CourseDTO courseDTO);
      String deleteCourse(Long courseId);
      Optional<Course> getCourseById(Long id);


}
