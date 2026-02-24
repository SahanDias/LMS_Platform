package nsbm.dea.lms.class_schedule.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class ReorderItemDTO {
    private UUID classId;
    private Integer position;
}

