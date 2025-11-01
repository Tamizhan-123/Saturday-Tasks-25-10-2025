package com.example.ClickCart.controller;

import com.example.ClickCart.dto.request.CreatePaymentIntentRequest;
import com.example.ClickCart.dto.request.CreateOrderFromPaymentRequest;
import com.example.ClickCart.dto.response.MessageResponse;
import com.example.ClickCart.dto.response.OrderWithUserResponse;
import com.example.ClickCart.entity.Order;
import com.example.ClickCart.entity.OrderStatus;
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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private StripeService stripeService;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody CreatePaymentIntentRequest request, Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            // Create payment intent first
            PaymentIntent paymentIntent = stripeService.createPaymentIntent(
                    request.getProductId(), 
                    request.getQuantity()
            );

            // Create order
            Order order = orderService.createOrder(
                    userPrincipal.getId(),
                    request.getProductId(),
                    request.getQuantity(),
                    request.getShippingAddress(),
                    request.getBillingAddress(),
                    paymentIntent.getId()
            );

            return ResponseEntity.ok(order);
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body("Error creating order: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/create-from-payment")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createOrderFromPayment(@Valid @RequestBody CreateOrderFromPaymentRequest request, Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            System.out.println("Creating order from payment for user: " + userPrincipal.getId());
            System.out.println("Product ID: " + request.getProductId());
            System.out.println("Quantity: " + request.getQuantity());
            System.out.println("Payment Intent ID: " + request.getPaymentIntentId());
            
            // Create order with existing payment intent ID
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
        } catch (Exception e) {
            System.err.println("Error creating order: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating order: " + e.getMessage());
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getUserOrders(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Order> orders = orderService.getUserOrders(userPrincipal.getId());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<Order> order = orderService.getOrderById(id);
        
        if (order.isPresent()) {
            // Check if user owns the order or is admin
            if (order.get().getUser().getId().equals(userPrincipal.getId()) || 
                userPrincipal.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.ok(order.get());
            } else {
                return ResponseEntity.status(403).build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody OrderStatus status) {
        Order order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderWithUserResponse>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        // Convert to DTO that includes user information for admin view
        List<OrderWithUserResponse> orderResponses = orders.stream()
                .map(OrderWithUserResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(orderResponses);
    }
}
