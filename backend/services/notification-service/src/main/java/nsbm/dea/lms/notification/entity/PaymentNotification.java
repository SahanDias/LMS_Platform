package nsbm.dea.lms.notification.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentName;

    @Column(nullable = false)
    private String courseName;

    @Column(nullable = false)
    private LocalDate paymentDate;

    @Column(nullable = false)
    private BigDecimal paymentAmount;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}

