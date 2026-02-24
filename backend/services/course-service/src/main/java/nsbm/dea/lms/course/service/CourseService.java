package nsbm.dea.lms.course.service;

import nsbm.dea.lms.course.entity.Course;
import nsbm.dea.lms.course.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    // Get all courses
    public List<Course> getCourses() {
        return courseRepository.findAll();
    }

    // Get course by ID
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    // Create a new course
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    // Update existing course
    public Course updateCourse(Long id, Course courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setThumbnailImgUrl(courseDetails.getThumbnailImgUrl());
        course.setPrice(courseDetails.getPrice());
        course.setPassingPercentage(courseDetails.getPassingPercentage());
        course.setCertificationEnabled(courseDetails.isCertificationEnabled());
        course.setStatus(courseDetails.getStatus());
        course.setCreatedBy(courseDetails.getCreatedBy());
        course.setUpdatedAt(courseDetails.getUpdatedAt());

        return courseRepository.save(course);
    }

    // Delete course
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        courseRepository.delete(course);
    }
}
