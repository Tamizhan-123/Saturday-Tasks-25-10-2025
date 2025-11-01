package com.example.ClickCart.controller;

import com.example.ClickCart.entity.Product;
import com.example.ClickCart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    ProductRepository productRepository;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProductsForAdmin() {
        List<Product> products = productRepository.findAll();
 System.out.println(products);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/products/inactive")
    public ResponseEntity<List<Product>> getInactiveProducts() {
        List<Product> products = productRepository.findAll().stream()
                .filter(product -> !product.getIsActive())
                .toList();
        return ResponseEntity.ok(products);
    }
}
