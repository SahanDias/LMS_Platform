package nsbm.dea.lms.notification.service;

import lombok.RequiredArgsConstructor;
import nsbm.dea.lms.notification.dto.NotificationResponse;
import nsbm.dea.lms.notification.entity.CourseNotification;
import nsbm.dea.lms.notification.entity.PaymentNotification;
import nsbm.dea.lms.notification.repository.CourseNotificationRepository;
import nsbm.dea.lms.notification.repository.PaymentNotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationQueryService {

    private final CourseNotificationRepository courseNotificationRepository;
    private final PaymentNotificationRepository paymentNotificationRepository;

    public List<NotificationResponse> getNotifications(String type) {
        List<NotificationResponse> all = new ArrayList<>();

        if (type == null || type.equalsIgnoreCase("ALL") || type.equalsIgnoreCase("COMPLETION")) {
            List<CourseNotification> courses = courseNotificationRepository.findAll();
            all.addAll(courses.stream().map(this::mapCourse).toList());
        }

        if (type == null || type.equalsIgnoreCase("ALL") || type.equalsIgnoreCase("PAYMENT")) {
            List<PaymentNotification> payments = paymentNotificationRepository.findAll();
            all.addAll(payments.stream().map(this::mapPayment).toList());
        }

        return all.stream()
                .sorted(Comparator.comparing(NotificationResponse::getTimestamp).reversed())
                .collect(Collectors.toList());
    }

    private NotificationResponse mapCourse(CourseNotification c) {
        LocalDateTime timestamp = c.getCreatedAt() != null
                ? c.getCreatedAt()
                : c.getCompletedDate().atStartOfDay();

        String title = "Course Completed";
        String message = "Congratulations! " + c.getStudentName()
                + " completed \"" + c.getCourseName() + "\".";

        return NotificationResponse.builder()
                .id(c.getId())
                .title(title)
                .message(message)
                .badgeLabel("Completion")
                .type(NotificationResponse.NotificationType.COMPLETION)
                .timestamp(timestamp)
                .read(false)
                .build();
    }

    private NotificationResponse mapPayment(PaymentNotification p) {
        LocalDateTime timestamp = p.getCreatedAt() != null
                ? p.getCreatedAt()
                : p.getPaymentDate().atStartOfDay();

        String title = "Payment Received";
        String message = "Payment of " + p.getPaymentAmount()
                + " received from " + p.getStudentName()
                + " for \"" + p.getCourseName() + "\".";

        return NotificationResponse.builder()
                .id(p.getId())
                .title(title)
                .message(message)
                .badgeLabel("Payment")
                .type(NotificationResponse.NotificationType.PAYMENT)
                .timestamp(timestamp)
                .read(false)
                .build();
    }
}

