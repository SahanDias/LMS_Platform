package nsbm.dea.lms.payment_service.controller;

import nsbm.dea.lms.payment_service.entity.Payment;
import nsbm.dea.lms.payment_service.repository.PaymentRepository;
import nsbm.dea.lms.payment_service.service.StripeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PaymentController {

    private final StripeService stripeService;
    private final PaymentRepository paymentRepository;

    public PaymentController(StripeService stripeService, PaymentRepository paymentRepository) {
        this.stripeService = stripeService;
        this.paymentRepository = paymentRepository;
    }

    @GetMapping("/create-payment-session")
    public String createSession() throws Exception {
        return stripeService.createCheckoutSession();
    }

    @GetMapping("/payments")
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}
