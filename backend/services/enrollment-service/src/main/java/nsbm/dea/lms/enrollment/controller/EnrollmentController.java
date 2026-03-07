package nsbm.dea.lms.enrollment.controller;

import nsbm.dea.lms.enrollment.dto.EnrollmentDTO;
import nsbm.dea.lms.enrollment.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Enrollment API + catalog (courses/classes from course service) + course proxy.
 */
@RestController
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    // ─── Enrollments ───────────────────────────────────────────────────────

    @PostMapping("/api/enrollments")
    public ResponseEntity<EnrollmentDTO> createEnrollment(@Valid @RequestBody EnrollmentDTO.CreateEnrollmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollmentService.createEnrollment(request));
    }

    @PostMapping("/api/enrollments/bulk")
    public ResponseEntity<Page<EnrollmentDTO>> bulkEnroll(@Valid @RequestBody EnrollmentDTO.BulkEnrollmentRequest request, Pageable pageable) {
        return ResponseEntity.status(HttpStatus.MULTI_STATUS).body(enrollmentService.bulkEnrollStudents(request, pageable));
    }

    @GetMapping("/api/enrollments/{id}")
    public ResponseEntity<EnrollmentDTO> getEnrollmentById(@PathVariable Long id) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentById(id));
    }

    @GetMapping("/api/enrollments/student/{studentId}")
    public ResponseEntity<Page<EnrollmentDTO>> getEnrollmentsByStudent(@PathVariable Long studentId, Pageable pageable) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByStudent(studentId, pageable));
    }

    @GetMapping("/api/enrollments/course/{courseId}")
    public ResponseEntity<Page<EnrollmentDTO>> getEnrollmentsByCourse(@PathVariable Long courseId, Pageable pageable) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByCourse(courseId, pageable));
    }

    @PutMapping("/api/enrollments/{id}/status")
    public ResponseEntity<EnrollmentDTO> updateEnrollmentStatus(@PathVariable Long id, @Valid @RequestBody EnrollmentDTO.UpdateEnrollmentStatusRequest request) {
        return ResponseEntity.ok(enrollmentService.updateEnrollmentStatus(id, request));
    }

    @PutMapping("/api/enrollments/{id}/transfer")
    public ResponseEntity<EnrollmentDTO> transferEnrollment(@PathVariable Long id, @Valid @RequestBody EnrollmentDTO.TransferClassRequest request) {
        return ResponseEntity.ok(enrollmentService.transferEnrollment(id, request));
    }

    @PutMapping("/api/enrollments/{id}/extend-deadline")
    public ResponseEntity<EnrollmentDTO> extendEnrollmentDeadline(@PathVariable Long id, @Valid @RequestBody EnrollmentDTO.ExtendDeadlineRequest request) {
        return ResponseEntity.ok(enrollmentService.extendEnrollmentDeadline(id, request));
    }

    @DeleteMapping("/api/enrollments/{id}")
    public ResponseEntity<Void> cancelEnrollment(@PathVariable Long id) {
        enrollmentService.cancelEnrollment(id);
        return ResponseEntity.noContent().build();
    }

    // ─── Catalog (courses + classes from course/class services) ─────────────

    @GetMapping("/api/catalog/courses")
    public ResponseEntity<List<EnrollmentDTO.CourseResponse>> getCatalogCourses() {
        return ResponseEntity.ok(enrollmentService.getCoursesForCatalog());
    }

    @GetMapping("/api/catalog/courses/{courseId}")
    public ResponseEntity<EnrollmentDTO.CourseResponse> getCatalogCourseById(@PathVariable Long courseId) {
        return enrollmentService.getCourseByIdForCatalog(courseId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/api/catalog/courses/{courseId}/classes")
    public ResponseEntity<List<EnrollmentDTO.ClassResponse>> getCatalogClassesByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentService.getClassesByCourseForCatalog(courseId));
    }

    // ─── Course proxy (forward to course service) ────────────────────────────

    @GetMapping("/course")
    public ResponseEntity<List<EnrollmentDTO.CourseDTO>> getAllCourses() {
        return ResponseEntity.ok(enrollmentService.getCourses());
    }

    @GetMapping("/course/{id}")
    public ResponseEntity<EnrollmentDTO.CourseDTO> getCourseById(@PathVariable Long id) {
        return enrollmentService.getCourseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/course")
    public ResponseEntity<EnrollmentDTO.CourseDTO> createCourse(@RequestBody EnrollmentDTO.CourseDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollmentService.createCourse(dto));
    }

    @PutMapping("/course/{id}")
    public ResponseEntity<EnrollmentDTO.CourseDTO> updateCourse(@PathVariable Long id, @RequestBody EnrollmentDTO.CourseDTO dto) {
        return ResponseEntity.ok(enrollmentService.updateCourse(id, dto));
    }

    @DeleteMapping("/course/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        enrollmentService.deleteCourse(id);
        return ResponseEntity.ok().build();
    }
}
