package nsbm.dea.lms.class_schedule.entity;

import jakarta.persistence.*;
import lombok.Data;
import nsbm.dea.lms.class_schedule.constant.ClassStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Data
@Table(name= "classes")
public class Classes {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "id", columnDefinition = "CHAR(36)")
    private UUID id;

    @Column(name = "course_id", nullable = true)
    private Long courseId;
    private String title;
    private String description;
    @Enumerated(EnumType.STRING)
    private ClassStatus status;

    @Column(name = "is_free")
    private Boolean isFree;

    @Column(name = "schedule_start_at")
    private Instant scheduleStartAt;

    @Column(name = "schedule_end_at")
    private Instant scheduleEndAt;

    @Column(name = "schedule_open")
    private Boolean scheduleOpen;

    private Integer position;
    @CreationTimestamp
    private Instant created_at;
    @UpdateTimestamp
    private Instant updated_at;

}
