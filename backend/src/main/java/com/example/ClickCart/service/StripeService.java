package com.example.ClickCart.service;

import com.example.ClickCart.entity.Product;
import com.example.ClickCart.repository.ProductRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;

@Service
public class StripeService {

    private static final Logger logger = LoggerFactory.getLogger(StripeService.class);

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Autowired
    private ProductRepository productRepository;

    @PostConstruct
    public void init() {
        if (stripeSecretKey == null || stripeSecretKey.trim().isEmpty()) {
            logger.error("Stripe secret key is null or empty!");
            throw new IllegalStateException("Stripe secret key is not configured");
        }
        
        stripeSecretKey = stripeSecretKey.trim();
        
        if (!stripeSecretKey.startsWith("sk_test_") && !stripeSecretKey.startsWith("sk_live_")) {
            logger.error("Invalid Stripe secret key format. Key starts with: {}", 
                stripeSecretKey.length() > 10 ? stripeSecretKey.substring(0, 10) : stripeSecretKey);
            throw new IllegalStateException("Invalid Stripe secret key format. Must start with sk_test_ or sk_live_");
        }
        
        Stripe.apiKey = stripeSecretKey;
        logger.info("Stripe API key initialized successfully (key starts with: {})", 
            stripeSecretKey.substring(0, Math.min(20, stripeSecretKey.length())));
    }

    public PaymentIntent createPaymentIntent(Long productId, Integer quantity) throws StripeException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        BigDecimal totalAmount = product.getPrice().multiply(BigDecimal.valueOf(quantity));
        long amountInCents = totalAmount.multiply(BigDecimal.valueOf(100)).longValue();

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("usd")
                .setDescription("Payment for " + product.getName())
                .build();

        return PaymentIntent.create(params);
    }

    public PaymentIntent confirmPaymentIntent(String paymentIntentId) throws StripeException {
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        return paymentIntent.confirm();
    }
}
