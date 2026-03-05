package nsbm.dea.lms.payment_service.service;

import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    public String createCheckoutSession(String studentName, String email, String course) throws Exception {

        SessionCreateParams.Builder builder = SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl("http://localhost:3000/success")
                        .setCancelUrl("http://localhost:3000/cancel")
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setQuantity(1L)
                                        .setPriceData(
                                                SessionCreateParams.LineItem.PriceData.builder()
                                                        .setCurrency("usd")
                                                        .setUnitAmount(2000L)
                                                        .setProductData(
                                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                        .setName("Test Product")
                                                                        .build()
                                                        )
                                                        .build()
                                        )
                                        .build()
                        );

        // add customer info and metadata
        if (email != null) {
            builder.setCustomerEmail(email);
            builder.putMetadata("studentEmail", email);
        }
        if (studentName != null) {
            // Stripe session doesn't have a setCustomerName method; keep in metadata
            builder.putMetadata("studentName", studentName);
        }
        if (course != null) builder.putMetadata("course", course);

        SessionCreateParams params = builder.build();

        Session session = Session.create(params);

        return session.getUrl();
    }
}
