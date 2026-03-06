package nsbm.dea.lms.payment_service.repository;

import nsbm.dea.lms.payment_service.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
