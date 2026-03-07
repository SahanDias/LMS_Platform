package nsbm.dea.lms.progress_service.controller;


import nsbm.dea.lms.progress_service.entity.Course;
import nsbm.dea.lms.progress_service.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/course")
public class CourseController {
    @Autowired
    CourseService courseService ;

    @GetMapping("/getAll")
    public List<Course> get() {
        try {
            List<Course> allCourse = courseService.getAllCourse();
            return allCourse ;


        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
