package nsbm.dea.lms.class_schedule.dto;

import lombok.Data;
import nsbm.dea.lms.class_schedule.constant.ClassStatus;

import java.util.UUID;

@Data
public class ClassesDTO {
    private UUID course_id;
    private String title;
    private String description;
    private ClassStatus status;
    private Boolean is_free;
}
