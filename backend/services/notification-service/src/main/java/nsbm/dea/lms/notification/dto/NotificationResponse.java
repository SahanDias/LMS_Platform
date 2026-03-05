package nsbm.dea.lms.notification.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {

    public enum NotificationType {
        COMPLETION,
        PAYMENT
    }

    private Long id;
    private String title;
    private String message;
    private String badgeLabel;
    private NotificationType type;
    private LocalDateTime timestamp;
    private boolean read;
}

