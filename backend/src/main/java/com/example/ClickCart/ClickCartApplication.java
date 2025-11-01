package com.example.ClickCart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync 
public class ClickCartApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClickCartApplication.class, args);
	}

}
