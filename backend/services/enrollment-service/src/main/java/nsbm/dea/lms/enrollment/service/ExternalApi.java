package nsbm.dea.lms.enrollment.service;

import nsbm.dea.lms.enrollment.dto.EnrollmentDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Optional;


@Component
public class ExternalApi {

    private final RestTemplate restTemplate;
    private final String courseBaseUrl;
    private final String classBaseUrl;
    private final String paymentBaseUrl;
    private final String progressBaseUrl;

    public ExternalApi(RestTemplate restTemplate,
                       @Value("${services.course.base-url:http://localhost:8081}") String courseBaseUrl,
                       @Value("${services.class.base-url:http://localhost:8083}") String classBaseUrl,
                       @Value("${services.payment.base-url:http://localhost:8084}") String paymentBaseUrl,
                       @Value("${services.progress.base-url:http://localhost:8085}") String progressBaseUrl) {
        this.restTemplate = restTemplate;
        this.courseBaseUrl = normalize(courseBaseUrl);
        this.classBaseUrl = normalize(classBaseUrl);
        this.paymentBaseUrl = normalize(paymentBaseUrl);
        this.progressBaseUrl = normalize(progressBaseUrl);
    }

    private static String normalize(String baseUrl) {
        String b = baseUrl == null ? "" : baseUrl.trim();
        return b.endsWith("/") ? b.substring(0, b.length() - 1) : b;
    }

    // ── Course service ─────────────────────────────────────────────────────

    public List<EnrollmentDTO.CourseDTO> getCourses() {
        String url = courseBaseUrl + "/course";
        try {
            ResponseEntity<List<EnrollmentDTO.CourseDTO>> res = restTemplate.exchange(
                    url, HttpMethod.GET, null, new ParameterizedTypeReference<List<EnrollmentDTO.CourseDTO>>() {});
            return res.getBody() != null ? res.getBody() : Collections.emptyList();
        } catch (Exception e) {
            throw new IllegalStateException("Course service is not reachable at " + url + ". " + e.getMessage(), e);
        }
    }

    public Optional<EnrollmentDTO.CourseDTO> getCourseById(Long id) {
        if (id == null) return Optional.empty();
        String url = courseBaseUrl + "/course/" + id;
        try {
            EnrollmentDTO.CourseDTO dto = restTemplate.getForObject(url, EnrollmentDTO.CourseDTO.class);
            return Optional.ofNullable(dto);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public EnrollmentDTO.CourseDTO createCourse(EnrollmentDTO.CourseDTO dto) {
        String url = courseBaseUrl + "/course";
        return restTemplate.postForObject(url, dto, EnrollmentDTO.CourseDTO.class);
    }

    public EnrollmentDTO.CourseDTO updateCourse(Long id, EnrollmentDTO.CourseDTO dto) {
        String url = courseBaseUrl + "/course/" + id;
        return restTemplate.exchange(url, HttpMethod.PUT, new org.springframework.http.HttpEntity<>(dto), EnrollmentDTO.CourseDTO.class).getBody();
    }

    public void deleteCourse(Long id) {
        String url = courseBaseUrl + "/course/" + id;
        restTemplate.exchange(url, HttpMethod.DELETE, null, Void.class);
    }

    // ── Class service ──────────────────────────────────────────────────────

    public List<EnrollmentDTO.ClassResponse> getClassesByCourse(String courseId) {
        if (courseId == null || courseId.isBlank()) return List.of();
        String url = classBaseUrl + "/api/v1/courses/" + courseId + "/classes";
        try {
            ResponseEntity<List<EnrollmentDTO.ClassResponse>> res = restTemplate.exchange(
                    url, HttpMethod.GET, null, new ParameterizedTypeReference<List<EnrollmentDTO.ClassResponse>>() {});
            return res.getBody() != null ? res.getBody() : Collections.emptyList();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public boolean hasCapacity(String classId, String courseId) {
        if (classId == null || courseId == null) return false;
        return getClassesByCourse(courseId).stream().anyMatch(c -> classId.equals(c.getId()));
    }

    // ── Payment service ────────────────────────────────────────────────────

    public boolean isPaymentConfirmed(Long paymentId) {
        if (paymentId == null) return false;
        String url = paymentBaseUrl + "/api/payments/" + paymentId + "/confirmed";
        try {
            Boolean confirmed = restTemplate.getForObject(url, Boolean.class);
            return Boolean.TRUE.equals(confirmed);
        } catch (Exception e) {
            return false;
        }
    }

    // ── Progress service (not used currently) ──────────────────────────────

    public boolean isCourseCompleted(Long enrollmentId) {
        if (enrollmentId == null) return false;
        String url = progressBaseUrl + "/api/progress/enrollments/" + enrollmentId + "/completed";
        try {
            Boolean completed = restTemplate.getForObject(url, Boolean.class);
            return Boolean.TRUE.equals(completed);
        } catch (Exception e) {
            return false;
        }
    }
}

