package nsbm.dea.lms.progress_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CourseDTO {
    private Long id;
    private String courseCode;
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
    private boolean isFree;
}