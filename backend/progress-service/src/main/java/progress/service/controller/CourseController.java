package progress.service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import progress.service.entity.Course;
import progress.service.service.CourseService;

import java.util.List;

@RestController
@RequestMapping("/progress/v1/course")
public class CourseController {
    @Autowired
    CourseService courseService;

    @GetMapping("/all")
    public List<Course> getAll() {
        try {
            List<Course> allCourse = courseService.getAllCourse();
            return allCourse;

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
