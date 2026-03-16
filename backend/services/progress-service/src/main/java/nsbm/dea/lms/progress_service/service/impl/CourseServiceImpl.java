package nsbm.dea.lms.progress_service.service.impl;

import nsbm.dea.lms.progress_service.dto.CourseDTO;
import nsbm.dea.lms.progress_service.entity.Course;
import nsbm.dea.lms.progress_service.repository.CourseRepo;
import nsbm.dea.lms.progress_service.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CourseServiceImpl implements CourseService {

    @Autowired
    CourseRepo courseRepo;

    @Override
    public List<Course> getAllCourse() {
        List<Course> all = courseRepo.findAll();
        return all;
    }
    @Override
    public String saveCourse(CourseDTO courseDTO) {
        Course course = new Course ();
        course.setCourseCode (courseDTO.getCourseCode ());
        course.setFree (true);
        course.setCreatedBy (courseDTO.getCreatedBy ());
        course.setPrice (courseDTO.getPrice ());
        course.setStatus (courseDTO.getStatus ());
        course.setPassingPercentage (courseDTO.getPassingPercentage ());
        course.setCertificationEnabled (courseDTO.isCertificationEnabled ());
        course.setThumbnailImgUrl (courseDTO.getThumbnailImgUrl ());
        course.setStatus (courseDTO.getStatus ());
        course.setDescription (courseDTO.getDescription ());
        course.setTitle (courseDTO.getTitle ());
        courseRepo.save (course);
        return "saved course " ;
    }

    @Override
    public String updateCourse(CourseDTO courseDTO) {
        System.out.println(courseDTO);

        Optional<Course> optionalCourse = courseRepo.findById(courseDTO.getId());
        if (optionalCourse.isPresent()) {
            Course course = optionalCourse.get(); 
            course.setCourseCode(courseDTO.getCourseCode());
            course.setFree(true); 
            course.setCreatedBy(courseDTO.getCreatedBy());
            course.setPrice(courseDTO.getPrice());
            course.setPassingPercentage(courseDTO.getPassingPercentage());
            course.setCertificationEnabled(courseDTO.isCertificationEnabled());
            course.setThumbnailImgUrl(courseDTO.getThumbnailImgUrl());
            course.setStatus(courseDTO.getStatus());
            course.setTitle(courseDTO.getTitle());
            course.setDescription (courseDTO.getDescription());

            courseRepo.save(course); 
            return "Course updated successfully";
        } else {
            return "Course Not Found";
        }
    }


    @Override
    public String deleteCourse(Long courseId) {
        if (courseRepo.existsById(courseId)) {
            courseRepo.deleteById(courseId);
            return "Course deleted successfully";
        } else {
            return "Course not found";
        }
    }

    @Override
    public Optional<Course> getCourseById(Long id) {
        if (courseRepo.existsById(id)) {
            return courseRepo.findById(id);
        } else {
            return Optional.empty();
        }
    }
}
