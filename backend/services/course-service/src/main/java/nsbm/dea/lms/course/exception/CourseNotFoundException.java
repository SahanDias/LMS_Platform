package nsbm.dea.lms.course.exception;

public class CourseNotFoundException extends RuntimeException {
    public CourseNotFoundException(Long id) {
        super("Course not found with id: " + id);
    }
}