package nsbm.dea.lms.enrollment.exception;

/** All enrollment-related exceptions in one file. */
public final class EnrollmentExceptions {

    private EnrollmentExceptions() {}

    public static class NotFound extends RuntimeException {
        public NotFound(Long id) {
            super("Enrollment not found with id: " + id);
        }
    }

    public static class InvalidState extends RuntimeException {
        public InvalidState(String message) {
            super(message);
        }
    }

    public static class ClassFull extends RuntimeException {
        public ClassFull(String classId) {
            super("Class is full for classId: " + classId);
        }
    }

    public static class CourseNotFound extends RuntimeException {
        public CourseNotFound(Long id) {
            super("Course not found: " + id);
        }
    }
}
