package nsbm.dea.lms.course.mapper;

import nsbm.dea.lms.course.dto.CourseDTO;
import nsbm.dea.lms.course.entity.Course;

public class CourseMapper {

    public static CourseDTO courseDTO(Course course){
        CourseDTO dto = new CourseDTO();

        dto.setId(course.getId());
        dto.setCourseCode((course.getCourseCode()));
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setThumbnailImgUrl(course.getThumbnailImgUrl());
        dto.setPrice(course.getPrice());
        dto.setPassingPercentage(course.getPassingPercentage());
        dto.setCertificationEnabled(course.isCertificationEnabled());
        dto.setStatus(course.getStatus());
        dto.setCreatedBy(course.getCreatedBy());
        dto.setCreatedAt(course.getCreatedAt());
        dto.setUpdatedAt(course.getUpdatedAt());
        dto.setFree(course.isFree());

        return dto;
    }

    public static Course toEntity(CourseDTO dto){
        Course course = new Course();

        course.setId(dto.getId());
        course.setCourseCode(dto.getCourseCode());
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setThumbnailImgUrl(dto.getThumbnailImgUrl());
        course.setPrice(dto.getPrice());
        course.setPassingPercentage(dto.getPassingPercentage());
        course.setCertificationEnabled(dto.isCertificationEnabled());
        course.setStatus(dto.getStatus());
        course.setCreatedBy(dto.getCreatedBy());
        course.setFree(dto.isFree());
        // createdAt and updatedAt are handled by @PrePersist / @PreUpdate

        return course;
    }
}
