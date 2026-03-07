package nsbm.dea.lms.video.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "video_completions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "video_id", nullable = false)
    private Long videoId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(nullable = false)
    private Boolean completed;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        if (completed == null) {
            completed = false;
        }
    }
}
