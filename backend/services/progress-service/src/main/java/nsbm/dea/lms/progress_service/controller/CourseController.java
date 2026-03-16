package nsbm.dea.lms.progress_service.controller;


import nsbm.dea.lms.progress_service.dto.CourseDTO;
import nsbm.dea.lms.progress_service.entity.Course;
import nsbm.dea.lms.progress_service.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/course")
public class CourseController {
    @Autowired
    CourseService courseService;

    @GetMapping("/getAll")
    public List<Course> get() {
        try {
            List<Course> allCourse = courseService.getAllCourse ();
            return allCourse;

        } catch (RuntimeException e) {
            throw new RuntimeException (e);
        }
    }

    @PostMapping("/save")
    public String save(@RequestBody CourseDTO courseDTO) {
        try {
            String saveCourse = courseService.saveCourse (courseDTO);
            return "course saved successfully";

        } catch (RuntimeException e) {
            throw new RuntimeException (e);
        }
    }

    @PutMapping("/update")
    public String update(@RequestBody CourseDTO courseDTO) {
        try {
            String updateCourse = courseService.updateCourse (courseDTO);
            return "course updated successfully";

        } catch (RuntimeException e) {
            throw new RuntimeException (e);
        }
    }

    @DeleteMapping("/delete/{courseId}")
    public String delete(@PathVariable Long courseId) {
        try {
            String deleteCourse = courseService.deleteCourse (courseId);
            return "course deleted successfully";
        } catch (RuntimeException e) {
            throw new RuntimeException (e);
        }
    }

    @GetMapping("/getCourse/{courseId}")
    public Optional<Course> getCourse(@PathVariable Long courseId) {
        return courseService.getCourseById(courseId);
    }

}
