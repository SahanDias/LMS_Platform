package nsbm.dea.lms.class_schedule.entity;

import jakarta.persistence.*;
import lombok.Data;
import nsbm.dea.lms.class_schedule.constant.ClassStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Data
@Table(name= "classes")
public class Classes {
    @Id
    @GeneratedValue
    private UUID id;
    private UUID course_id;
    private String title;
    private String description;
    @Enumerated(EnumType.STRING)
    private ClassStatus status;
    private Boolean is_free;
    @CreationTimestamp
    private Instant created_at;
    @UpdateTimestamp
    private Instant updated_at;

}
