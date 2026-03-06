package nsbm.dea.lms.enrollment.dto;

import nsbm.dea.lms.enrollment.entity.enums.EnrollmentStatus;
import lombok.Data;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/** Enrollment entity DTO and all enrollment-related request/response types. */
@Data
public class EnrollmentDTO {
    private Long id;
    private Long studentId;
    private Long courseId;
    private String classId;
    private Long paymentId;
    private EnrollmentStatus status;
    private LocalDateTime enrollmentDate;
    private LocalDateTime deadlineDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class CreateEnrollmentRequest {
        @NotNull private Long studentId;
        @NotNull private Long courseId;
        @NotNull private String classId;
        @NotNull private Long paymentId;
        @FutureOrPresent private LocalDateTime deadlineDate;
    }

    @Data
    public static class UpdateEnrollmentStatusRequest {
        @NotNull private EnrollmentStatus status;
    }

    @Data
    public static class TransferClassRequest {
        @NotNull private String targetClassId;
    }

    @Data
    public static class ExtendDeadlineRequest {
        @NotNull @FutureOrPresent private LocalDateTime newDeadlineDate;
    }

    @Data
    public static class BulkEnrollmentRequest {
        @NotEmpty @Valid private List<CreateEnrollmentRequest> enrollments;
    }

    /** Course service response (GET /course). */
    @Data
    public static class CourseDTO {
        private Long id;
        private String title;
        private String description;
        private String thumbnailImgUrl;
        private BigDecimal price;
        private int passingPercentage;
        private boolean certificationEnabled;
        private String status;
        private Long createdBy;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    /** Catalog API response (course with uuid for class service). */
    @Data
    public static class CourseResponse {
        private Long id;
        private String courseCode;
        private String title;
        private String description;
        private String thumbnailImgUrl;
        private BigDecimal price;
        private Integer passingPercentage;
        private Boolean certificationEnabled;
        private String status;
        private Long createdBy;
        private String createdAt;
        private String updatedAt;
        private String uuid;
    }

    /** Class service response (GET /api/v1/courses/{id}/classes). */
    @Data
    public static class ClassResponse {
        private String id;
        private String courseId;
        private String title;
        private String description;
        private String status;
        private Boolean isFree;
        private String scheduleStartAt;
        private String scheduleEndAt;
        private Boolean scheduleOpen;
        private Integer position;
    }
}
