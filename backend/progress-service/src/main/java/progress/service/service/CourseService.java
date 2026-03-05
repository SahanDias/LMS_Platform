package progress.service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import progress.service.dto.CourseDto;
import progress.service.entity.Course;
import progress.service.repo.CourseRepo;

import java.util.List;

@Transactional
@Service

public class CourseService {
    @Autowired
    CourseRepo courseRepo ;

    public List<Course> getAllCourse() {
        java.util.List<Course> all = courseRepo.findAll();
        return all ;
    }
}
