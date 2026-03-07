package nsbm.dea.lms.progress_service.service.impl;

import nsbm.dea.lms.progress_service.entity.Course;
import nsbm.dea.lms.progress_service.repository.CourseRepo;
import nsbm.dea.lms.progress_service.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class CourseServiceImpl implements CourseService {
    @Autowired
    CourseRepo courseRepo;

    @Override
    public List<Course> getAllCourse() {
        List<Course>  all = courseRepo.findAll();
        return all;
    }
}
