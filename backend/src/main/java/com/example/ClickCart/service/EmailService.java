package com.example.ClickCart.service;

import com.example.ClickCart.entity.Order;
import com.example.ClickCart.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;
    @Async
    public void sendOrderConfirmationEmail(User user, Order order) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setFrom(fromEmail);
        message.setSubject("Order Confirmation - ClickCart");
        
        StringBuilder emailBody = new StringBuilder();
        emailBody.append("Dear ").append(user.getFirstName()).append(" ").append(user.getLastName()).append(",\n\n");
        emailBody.append("Thank you for your order! Your order has been confirmed.\n\n");
        emailBody.append("Order Details:\n");
        emailBody.append("Order ID: ").append(order.getId()).append("\n");
        emailBody.append("Total Amount: $").append(order.getTotalAmount()).append("\n");
        emailBody.append("Status: ").append(order.getStatus()).append("\n\n");
        
        emailBody.append("Items Ordered:\n");
        order.getOrderItems().forEach(item -> {
            emailBody.append("- ").append(item.getProduct().getName())
                    .append(" (Qty: ").append(item.getQuantity())
                    .append(", Price: $").append(item.getUnitPrice()).append(")\n");
        });
        
        emailBody.append("\nShipping Address:\n").append(order.getShippingAddress()).append("\n\n");
        emailBody.append("Thank you for shopping with ClickCart!\n\n");
        emailBody.append("Best regards,\nClickCart Team");
        
        message.setText(emailBody.toString());
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
    @Async
    public void sendOrderStatusUpdateEmail(User user, Order order) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setFrom(fromEmail);
        message.setSubject("Order Status Update - ClickCart");
        
        StringBuilder emailBody = new StringBuilder();
        emailBody.append("Dear ").append(user.getFirstName()).append(" ").append(user.getLastName()).append(",\n\n");
        emailBody.append("Your order status has been updated.\n\n");
        emailBody.append("Order ID: ").append(order.getId()).append("\n");
        emailBody.append("New Status: ").append(order.getStatus()).append("\n\n");
        
        if (order.getStatus().toString().equals("SHIPPED")) {
            emailBody.append("Your order has been shipped and is on its way to you!\n");
        } else if (order.getStatus().toString().equals("DELIVERED")) {
            emailBody.append("Your order has been delivered. Thank you for your purchase!\n");
        }
        
        emailBody.append("\nThank you for shopping with ClickCart!\n\n");
        emailBody.append("Best regards,\nClickCart Team");
        
        message.setText(emailBody.toString());
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}

