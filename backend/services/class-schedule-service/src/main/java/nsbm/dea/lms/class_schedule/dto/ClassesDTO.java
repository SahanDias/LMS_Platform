package nsbm.dea.lms.class_schedule.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;
import nsbm.dea.lms.class_schedule.constant.ClassStatus;

import java.util.UUID;

@Data
public class ClassesDTO {
    @JsonAlias("course_id")
    private UUID courseId;
    private String title;
    private String description;
    private ClassStatus status;

    @JsonAlias("is_free")
    private Boolean isFree;

    private Integer position;
}
