package nsbm.dea.lms.payment_service.controller;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import nsbm.dea.lms.payment_service.entity.Payment;
import nsbm.dea.lms.payment_service.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/stripe")
public class StripeWebhookController {

    private final PaymentRepository paymentRepository;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    public StripeWebhookController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @PostMapping("/webhook")
    public void handleStripeEvent(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        Stripe.apiKey = stripeSecretKey;
        System.out.println("Received webhook: " + sigHeader);
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
            System.out.println("Event type: " + event.getType());

            if ("checkout.session.completed".equals(event.getType())) {
                System.out.println("Processing checkout.session.completed");
                System.out.println("Event data: " + event.getData().toJson());

                Optional<StripeObject> object = event.getDataObjectDeserializer().getObject();

                if (!object.isPresent()) {
                    System.out.println("Trying unsafe deserialization");
                    object = Optional.ofNullable(event.getDataObjectDeserializer().deserializeUnsafe());
                }

                if (object.isPresent()) {
                    Session session = (Session) object.get();
                    System.out.println("Session ID: " + session.getId());
                    System.out.println("Amount Total: " + session.getAmountTotal());
                    System.out.println("Currency: " + session.getCurrency());

                    Payment payment = new Payment();
                    payment.setStripeSessionId(session.getId());
                    payment.setAmount(session.getAmountTotal() / 100.0);
                    payment.setCurrency(session.getCurrency());
                    payment.setStatus("SUCCESS");

                    paymentRepository.save(payment);

                    System.out.println("PAYMENT SAVED: " + session.getId());
                } else {
                    System.out.println("Object not present in event data");
                }
            } else {
                System.out.println("Ignoring event type: " + event.getType());
            }
        } catch (SignatureVerificationException e) {
            System.err.println("Webhook signature verification failed: " + e.getMessage());
            throw new RuntimeException("Invalid signature");
        } catch (Exception e) {
            System.err.println("Error processing webhook: " + e.getMessage());
            e.printStackTrace();
        }
    }
}