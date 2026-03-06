package nsbm.dea.lms.enrollment.dto;

import lombok.Data;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/** Waitlist entity DTO and request. */
@Data
public class WaitlistDTO {
    private Long id;
    private Long studentId;
    private Long courseId;
    private String classId;
    private Integer position;
    private Boolean holdPaymentStatus;
    private LocalDateTime createdAt;

    @Data
    public static class CreateWaitlistRequest {
        @NotNull private Long studentId;
        @NotNull private Long courseId;
        @NotNull private String classId;
        @NotNull private Boolean holdPaymentStatus;
    }
}
