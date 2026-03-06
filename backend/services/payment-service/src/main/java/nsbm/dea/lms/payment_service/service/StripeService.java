package nsbm.dea.lms.payment_service.service;

import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    public String createCheckoutSession(String studentName, String email, String course, Double amount) throws Exception {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Invalid amount. A positive course fee is required.");
        }
        long unitAmountInCents = Math.round(amount * 100);

        String courseName = (course != null && !course.isBlank()) ? course : "LMS Course";

        SessionCreateParams.Builder builder = SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl("http://localhost:8082/success")
                        .setCancelUrl("http://localhost:8082/failed")
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setQuantity(1L)
                                        .setPriceData(
                                                SessionCreateParams.LineItem.PriceData.builder()
                                                        .setCurrency("usd")
                                                .setUnitAmount(unitAmountInCents)
                                                        .setProductData(
                                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName(courseName)
                                                                        .build()
                                                        )
                                                        .build()
                                        )
                                        .build()
                        );

        // add customer info and metadata
        if (email != null && !email.isBlank()) {
            builder.putMetadata("studentEmail", email);
        }
        if (studentName != null) {
            // Stripe session doesn't have a setCustomerName method; keep in metadata
            builder.putMetadata("studentName", studentName);
        }
        if (course != null) builder.putMetadata("course", course);
        if (amount != null) builder.putMetadata("amount", String.valueOf(amount));

        SessionCreateParams params = builder.build();

        Session session = Session.create(params);

        return session.getUrl();
    }
}
