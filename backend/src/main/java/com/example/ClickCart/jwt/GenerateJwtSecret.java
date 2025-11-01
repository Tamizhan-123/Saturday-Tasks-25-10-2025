package com.example.ClickCart.jwt;

import io.jsonwebtoken.security.Keys;
import java.util.Base64;
import javax.crypto.SecretKey;

public class GenerateJwtSecret {
    public static void main(String[] args) {
        // Generate a secure random key for HS256 algorithm
        SecretKey key = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);

        // Convert to Base64 string
        String secret = Base64.getEncoder().encodeToString(key.getEncoded());

        System.out.println("Your JWT Secret Key:");
        System.out.println(secret);
    }
}
