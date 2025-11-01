package com.example.ClickCart.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

public class CreatePaymentIntentRequest {
    @NotNull
    private Long productId;
    
    @Min(1)
    private Integer quantity;
    
    @NotNull
    private String shippingAddress;
    
    @NotNull
    private String billingAddress;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getBillingAddress() {
        return billingAddress;
    }

    public void setBillingAddress(String billingAddress) {
        this.billingAddress = billingAddress;
    }
}

