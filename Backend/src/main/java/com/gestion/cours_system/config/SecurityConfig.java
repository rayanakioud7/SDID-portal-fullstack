package com.gestion.cours_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 1. The Tool: Define the BCrypt Encoder so we can use it anywhere
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. The Rules: Who can access what?
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF so Postman can send POST requests
            .authorizeHttpRequests(auth -> auth
                // For now, we allow EVERYTHING so you can keep testing easily.
                // Later, we will lock this down to only allow logged-in users.
                .anyRequest().permitAll()
            );
        
        return http.build();
    }
}