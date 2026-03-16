package nsbm.dea.lms.payment_service.controller;

import nsbm.dea.lms.payment_service.entity.Payment;
import nsbm.dea.lms.payment_service.repository.PaymentRepository;
import nsbm.dea.lms.payment_service.service.StripeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
public class PaymentController {

    private final StripeService stripeService;
    private final PaymentRepository paymentRepository;

    public PaymentController(StripeService stripeService, PaymentRepository paymentRepository) {
        this.stripeService = stripeService;
        this.paymentRepository = paymentRepository;
    }

    @PostMapping("/create-payment-session")
    public String createSessionFromBody(@RequestBody CreatePaymentSessionRequest request) throws Exception {
        validateAmount(request.amount());
        return stripeService.createCheckoutSession(
                request.studentName(),
                request.email(),
                request.course(),
                request.amount()
        );
    }

    @GetMapping("/create-payment-session")
    public String createSession(
            @RequestParam(name = "studentName", required = false) String studentName,
            @RequestParam(name = "email", required = false) String email,
            @RequestParam(name = "course", required = false) String course,
            @RequestParam(name = "amount", required = false) Double amount
    ) throws Exception {
        validateAmount(amount);
        return stripeService.createCheckoutSession(studentName, email, course, amount);
    }

    @GetMapping("/payments")
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @GetMapping("/payments/stats")
    public Map<String, Object> getPaymentStats() {
        List<Payment> all = paymentRepository.findAll();
        Map<String, Object> stats = new HashMap<>();
        
        double totalRevenue = all.stream()
                .filter(p -> "SUCCESS".equals(p.getStatus()))
                .mapToDouble(Payment::getAmount)
                .sum();
        
        long totalTransactions = all.size();
        long successfulTransactions = all.stream()
                .filter(p -> "SUCCESS".equals(p.getStatus()))
                .count();
        
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalTransactions", totalTransactions);
        stats.put("successfulTransactions", successfulTransactions);
        stats.put("failedTransactions", totalTransactions - successfulTransactions);
        
        return stats;
    }

    @GetMapping("/payments/search")
    public List<Payment> searchPayments(
            @RequestParam(name = "studentName", required = false) String studentName,
            @RequestParam(name = "status", required = false) String status
    ) {
        List<Payment> all = paymentRepository.findAll();
        
        return all.stream()
                .filter(p -> studentName == null || (p.getStudentName() != null && p.getStudentName().toLowerCase().contains(studentName.toLowerCase())))
                .filter(p -> status == null || status.equals(p.getStatus()))
                .toList();
    }

    @DeleteMapping("/payments/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        if (!paymentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found");
        }
        paymentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    public record CreatePaymentSessionRequest(
            String studentName,
            String email,
            String course,
            Double amount
    ) {}

    private static void validateAmount(Double amount) {
        if (amount == null || amount <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid amount. A positive course fee is required."
            );
        }
    }
}
