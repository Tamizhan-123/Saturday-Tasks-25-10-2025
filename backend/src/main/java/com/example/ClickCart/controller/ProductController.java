package com.example.ClickCart.controller;

import com.example.ClickCart.entity.Product;
import com.example.ClickCart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productRepository.findByIsActiveTrue();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent() && product.get().getIsActive()) {
            return ResponseEntity.ok(product.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        List<Product> products = productRepository.searchProducts(keyword);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productRepository.findByCategoryAndIsActiveTrue(category);
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        System.out.println("=== CREATE PRODUCT METHOD CALLED ===");
        System.out.println("Product received: " + product);
        
        try {
            System.out.println("Step 1: Validating product data...");
            System.out.println("Name: " + product.getName());
            System.out.println("Price: " + product.getPrice());
            System.out.println("Stock: " + product.getStockQuantity());
            
            System.out.println("Step 2: Saving product to database...");
            Product savedProduct = productRepository.save(product);
            
            System.out.println("Step 3: Product saved successfully with ID: " + savedProduct.getId());
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            System.out.println("Error creating product: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(400).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            Product existingProduct = product.get();
//            existingProduct.setName(productDetails.getName());
//            existingProduct.setDescription(productDetails.getDescription());
//            existingProduct.setPrice(productDetails.getPrice());
//            existingProduct.setStockQuantity(productDetails.getStockQuantity());
//            existingProduct.setImageUrl(productDetails.getImageUrl());
//            existingProduct.setCategory(productDetails.getCategory());
            existingProduct.setIsActive(productDetails.getIsActive());
            
            Product updatedProduct = productRepository.save(existingProduct);
          
            return ResponseEntity.ok(updatedProduct);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            Product existingProduct = product.get();
            existingProduct.setIsActive(false);
            productRepository.save(existingProduct);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
