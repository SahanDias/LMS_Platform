package nsbm.dea.lms.progress_service.service;

import nsbm.dea.lms.progress_service.entity.Course;

import java.util.List;

public interface CourseService {
    default List<Course> getAllCourse() {
        return null;
    }
}
