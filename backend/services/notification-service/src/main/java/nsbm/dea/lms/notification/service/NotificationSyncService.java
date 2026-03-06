package nsbm.dea.lms.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nsbm.dea.lms.notification.dto.CourseNotificationApiResponse;
import nsbm.dea.lms.notification.dto.PaymentNotificationApiResponse;
import nsbm.dea.lms.notification.entity.CourseNotification;
import nsbm.dea.lms.notification.entity.PaymentNotification;
import nsbm.dea.lms.notification.repository.CourseNotificationRepository;
import nsbm.dea.lms.notification.repository.PaymentNotificationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationSyncService {

    private final RestTemplate restTemplate;
    private final CourseNotificationRepository courseNotificationRepository;
    private final PaymentNotificationRepository paymentNotificationRepository;

    @Value("${external.notifications.course-url}")
    private String courseNotificationUrl;

    @Value("${external.notifications.payment-url}")
    private String paymentNotificationUrl;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // Runs shortly after startup, then every hour
    @Scheduled(initialDelayString = "PT5S", fixedDelayString = "PT1H")
    public void syncNotificationsHourly() {
        log.info("Starting hourly notification sync");
        syncCourseNotifications();
        syncPaymentNotifications();
        log.info("Finished hourly notification sync");
    }

    public void syncCourseNotifications() {
        try {
            ResponseEntity<List<CourseNotificationApiResponse>> response =
                    restTemplate.exchange(
                            courseNotificationUrl,
                            HttpMethod.GET,
                            null,
                            new ParameterizedTypeReference<List<CourseNotificationApiResponse>>() {
                            });

            List<CourseNotificationApiResponse> body = response.getBody();
            if (body == null) {
                log.warn("Course notifications API returned null body");
                return;
            }

            int inserted = 0;
            for (CourseNotificationApiResponse item : body) {
                LocalDate completedDate = LocalDate.parse(item.getCompletedDate(), DATE_FORMATTER);

                boolean exists = courseNotificationRepository
                        .existsByCourseNameAndStudentNameAndCompletedDate(
                                item.getCourseName(),
                                item.getStudentName(),
                                completedDate
                        );

                if (!exists) {
                    CourseNotification entity = CourseNotification.builder()
                            .courseName(item.getCourseName())
                            .studentName(item.getStudentName())
                            .completedDate(completedDate)
                            .status(item.getStatus())
                            .createdAt(LocalDateTime.now())
                            .build();
                    courseNotificationRepository.save(entity);
                    inserted++;
                }
            }
            log.info("Course notifications fetched={}, inserted={}", body.size(), inserted);
        } catch (Exception ex) {
            log.error("Failed to sync course notifications", ex);
        }
    }

    public void syncPaymentNotifications() {
        try {
            ResponseEntity<List<PaymentNotificationApiResponse>> response =
                    restTemplate.exchange(
                            paymentNotificationUrl,
                            HttpMethod.GET,
                            null,
                            new ParameterizedTypeReference<List<PaymentNotificationApiResponse>>() {
                            });

            List<PaymentNotificationApiResponse> body = response.getBody();
            if (body == null) {
                log.warn("Payment notifications API returned null body");
                return;
            }

            int inserted = 0;
            for (PaymentNotificationApiResponse item : body) {
                LocalDate paymentDate = LocalDate.parse(item.getPaymentDate(), DATE_FORMATTER);

                boolean exists = paymentNotificationRepository
                        .existsByStudentNameAndCourseNameAndPaymentDateAndPaymentAmount(
                                item.getStudentName(),
                                item.getCourseName(),
                                paymentDate,
                                item.getPaymentAmount()
                        );

                if (!exists) {
                    PaymentNotification entity = PaymentNotification.builder()
                            .studentName(item.getStudentName())
                            .courseName(item.getCourseName())
                            .paymentDate(paymentDate)
                            .paymentAmount(item.getPaymentAmount())
                            .createdAt(LocalDateTime.now())
                            .build();
                    paymentNotificationRepository.save(entity);
                    inserted++;
                }
            }
            log.info("Payment notifications fetched={}, inserted={}", body.size(), inserted);
        } catch (Exception ex) {
            log.error("Failed to sync payment notifications", ex);
        }
    }
}

