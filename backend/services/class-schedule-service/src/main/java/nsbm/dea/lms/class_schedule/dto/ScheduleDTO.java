package nsbm.dea.lms.class_schedule.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

import java.time.Instant;

@Data
public class ScheduleDTO {
    @JsonAlias("schedule_start_at")
    private Instant scheduleStartAt;

    @JsonAlias("schedule_end_at")
    private Instant scheduleEndAt;

    @JsonAlias("schedule_open")
    private Boolean scheduleOpen;
}

