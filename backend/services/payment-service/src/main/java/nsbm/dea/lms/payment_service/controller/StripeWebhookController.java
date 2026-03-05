package nsbm.dea.lms.payment_service.controller;

import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import nsbm.dea.lms.payment_service.entity.Payment;
import nsbm.dea.lms.payment_service.repository.PaymentRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stripe")
public class StripeWebhookController {

    private final PaymentRepository paymentRepository;

    public StripeWebhookController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @PostMapping("/webhook")
    public void handleStripeEvent(@RequestBody String payload) throws Exception {

        Event event = Event.GSON.fromJson(payload, Event.class);

        if ("checkout.session.completed".equals(event.getType())) {

            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject()
                    .orElse(null);

            if (session != null) {

                Payment payment = new Payment();
                payment.setStripeSessionId(session.getId());
                payment.setAmount(session.getAmountTotal() / 100.0);
                payment.setCurrency(session.getCurrency());
                payment.setStatus("SUCCESS");

                paymentRepository.save(payment);
            }
        }
    }
}