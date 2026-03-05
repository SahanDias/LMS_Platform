package nsbm.dea.lms.notification.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentNotificationApiResponse {

    private String studentName;
    private String courseName;
    private String paymentDate;
    private BigDecimal paymentAmount;
}

