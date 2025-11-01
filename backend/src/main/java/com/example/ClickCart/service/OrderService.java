package com.example.ClickCart.service;

import com.example.ClickCart.entity.*;
import com.example.ClickCart.repository.OrderRepository;
import com.example.ClickCart.repository.ProductRepository;
import com.example.ClickCart.repository.UserRepository;
import com.example.ClickCart.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SMSService smsService;

    public Order createOrder(Long userId, Long productId, Integer quantity, String shippingAddress, String billingAddress, String stripePaymentIntentId) {
        System.out.println("OrderService.createOrder called");
        System.out.println("UserId: " + userId + ", ProductId: " + productId + ", Quantity: " + quantity);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        Order order = new Order();
        order.setUser(user);  // This should work now that we removed the incomplete setUser override
        order.setShippingAddress(shippingAddress);
        order.setBillingAddress(billingAddress);
        order.setStripePaymentIntentId(stripePaymentIntentId);
        order.setStatus(OrderStatus.PROCESSING);

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(quantity);
        orderItem.setUnitPrice(product.getPrice());
        orderItem.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)));

        order.getOrderItems().add(orderItem);
        order.setTotalAmount(orderItem.getTotalPrice());

        // Update product stock
        product.setStockQuantity(product.getStockQuantity() - quantity);
        productRepository.save(product);
        System.out.println("Product stock updated");

        Order savedOrder = orderRepository.save(order);
        System.out.println("Order saved with ID: " + savedOrder.getId());

        // Send notifications asynchronously (don't block the response)
        try {
            emailService.sendOrderConfirmationEmail(user, savedOrder);
//            smsService.sendOrderConfirmationSMS(user, savedOrder);
        } catch (Exception e) {
            System.err.println("Failed to send notifications: " + e.getMessage());
            // Don't fail the order creation if notifications fail
        }

        return savedOrder;
    }

    public List<Order> getUserOrders(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Use query with JOIN FETCH to eagerly load products
        return orderRepository.findByUserWithItemsAndProducts(user);
    }

    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        
        Order savedOrder = orderRepository.save(order);
        
        // Send status update notifications
        try {
            emailService.sendOrderStatusUpdateEmail(order.getUser(), savedOrder);
            smsService.sendOrderStatusUpdateSMS(order.getUser(), savedOrder);
        } catch (Exception e) {
            System.err.println("Failed to send status update notifications: " + e.getMessage());
        }
        
        return savedOrder;
    }

    public List<Order> getAllOrders() {
        // Use query that eagerly fetches user for admin views
        return orderRepository.findAllWithUserAndItems();
    }
}
