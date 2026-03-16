package nsbm.dea.lms.course.service;

import nsbm.dea.lms.course.dto.CourseDTO;
import nsbm.dea.lms.course.entity.Course;
import nsbm.dea.lms.course.exception.CourseNotFoundException;
import nsbm.dea.lms.course.mapper.CourseMapper;
import nsbm.dea.lms.course.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    // Get all courses
    public List<CourseDTO> getCourses() {
        return courseRepository.findAll()
                .stream()
                .map(CourseMapper::courseDTO)
                .collect(Collectors.toList());
    }

    // Get course by ID
    public Optional<CourseDTO> getCourseById(Long id) {
        return courseRepository.findById(id)
                .map(CourseMapper::courseDTO);
    }

    // Create a new course
    public CourseDTO createCourse(CourseDTO courseDTO) {
        Course course = CourseMapper.toEntity(courseDTO);
        Course saved = courseRepository.save(course);
        return CourseMapper.courseDTO(saved);
    }

    // Update existing course
    public CourseDTO updateCourse(Long id, CourseDTO courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new CourseNotFoundException(id));

        course.setCourseCode(courseDetails.getCourseCode());
        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setThumbnailImgUrl(courseDetails.getThumbnailImgUrl());
        course.setPrice(courseDetails.getPrice());
        course.setPassingPercentage(courseDetails.getPassingPercentage());
        course.setCertificationEnabled(courseDetails.isCertificationEnabled());
        course.setStatus(courseDetails.getStatus());
        course.setCreatedBy(courseDetails.getCreatedBy());
        course.setFree(courseDetails.isFree());
        // updatedAt is handled by @PreUpdate

        Course updated = courseRepository.save(course);
        return CourseMapper.courseDTO(updated);
    }

    // Delete course
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new CourseNotFoundException(id));
        courseRepository.delete(course);
    }
}