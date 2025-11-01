package com.example.ClickCart.service;

import com.example.ClickCart.entity.Order;
import com.example.ClickCart.entity.User;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class SMSService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String twilioPhoneNumber;

    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
    }

    public void sendOrderConfirmationSMS(User user, Order order) {
        if (user.getPhoneNumber() == null || user.getPhoneNumber().isEmpty()) {
            System.out.println("No phone number available for user: " + user.getUsername());
            return;
        }

        String messageBody = "Hi " + user.getFirstName() + "! Your ClickCart order #" + order.getId() + 
                           " has been confirmed. Total: $" + order.getTotalAmount() + 
                           ". Thank you for shopping with us!";

        try {
            Message message = Message.creator(
                    new PhoneNumber(user.getPhoneNumber()),
                    new PhoneNumber(twilioPhoneNumber),
                    messageBody
            ).create();

            System.out.println("SMS sent successfully. SID: " + message.getSid());
        } catch (Exception e) {
            System.err.println("Failed to send SMS: " + e.getMessage());
        }
    }

    public void sendOrderStatusUpdateSMS(User user, Order order) {
        if (user.getPhoneNumber() == null || user.getPhoneNumber().isEmpty()) {
            System.out.println("No phone number available for user: " + user.getUsername());
            return;
        }

        String messageBody = "Hi " + user.getFirstName() + "! Your ClickCart order #" + order.getId() + 
                           " status has been updated to: " + order.getStatus() + 
                           ". Thank you for shopping with us!";

        try {
            Message message = Message.creator(
                    new PhoneNumber(user.getPhoneNumber()),
                    new PhoneNumber(twilioPhoneNumber),
                    messageBody
            ).create();

            System.out.println("SMS sent successfully. SID: " + message.getSid());
        } catch (Exception e) {
            System.err.println("Failed to send SMS: " + e.getMessage());
        }
    }
}

