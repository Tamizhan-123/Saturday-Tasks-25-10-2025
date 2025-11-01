package com.example.ClickCart.controller;

import com.example.ClickCart.dto.request.CreatePaymentIntentRequest;
import com.example.ClickCart.dto.request.CreateOrderFromPaymentRequest;
import com.example.ClickCart.dto.response.PaymentIntentResponse;
import com.example.ClickCart.entity.Order;
import com.example.ClickCart.security.UserPrincipal;
import com.example.ClickCart.service.OrderService;
import com.example.ClickCart.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private StripeService stripeService;

    @Autowired
    private OrderService orderService;

    @PostMapping("/create-payment-intent")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createPaymentIntent(@Valid @RequestBody CreatePaymentIntentRequest request) {
        try {
            PaymentIntent paymentIntent = stripeService.createPaymentIntent(
                    request.getProductId(), 
                    request.getQuantity()
            );
            
            return ResponseEntity.ok(new PaymentIntentResponse(
                    paymentIntent.getClientSecret(),
                    paymentIntent.getId()
            ));
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body("Error creating payment intent: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/confirm-payment/{paymentIntentId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> confirmPayment(@PathVariable String paymentIntentId) {
        try {
            PaymentIntent paymentIntent = stripeService.confirmPaymentIntent(paymentIntentId);
            return ResponseEntity.ok(paymentIntent);
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body("Error confirming payment: " + e.getMessage());
        }
    }

    @PostMapping("/confirm-and-create-order")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> confirmPaymentAndCreateOrder(@Valid @RequestBody CreateOrderFromPaymentRequest request, Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            System.out.println("Confirming payment and creating order for user: " + userPrincipal.getId());
            System.out.println("Payment Intent ID: " + request.getPaymentIntentId());
            
            // Verify payment intent status with Stripe
            PaymentIntent paymentIntent = PaymentIntent.retrieve(request.getPaymentIntentId());
            
            if (!"succeeded".equals(paymentIntent.getStatus())) {
                return ResponseEntity.badRequest().body("Payment not confirmed. Status: " + paymentIntent.getStatus());
            }
            
            System.out.println("Payment confirmed successfully. Creating order...");
            
            // Create order with confirmed payment intent
            Order order = orderService.createOrder(
                    userPrincipal.getId(),
                    request.getProductId(),
                    request.getQuantity(),
                    request.getShippingAddress(),
                    request.getBillingAddress(),
                    request.getPaymentIntentId()
            );

            System.out.println("Order created successfully with ID: " + order.getId());
            return ResponseEntity.ok(order);
        } catch (StripeException e) {
            System.err.println("Stripe error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error verifying payment: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error creating order: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating order: " + e.getMessage());
        }
    }
}

