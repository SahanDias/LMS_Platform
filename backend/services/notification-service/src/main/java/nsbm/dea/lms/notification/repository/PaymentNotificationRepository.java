package nsbm.dea.lms.notification.repository;

import nsbm.dea.lms.notification.entity.PaymentNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface PaymentNotificationRepository extends JpaRepository<PaymentNotification, Long> {

    boolean existsByStudentNameAndCourseNameAndPaymentDateAndPaymentAmount(
            String studentName,
            String courseName,
            LocalDate paymentDate,
            BigDecimal paymentAmount
    );
}

