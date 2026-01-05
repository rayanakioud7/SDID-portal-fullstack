package com.gestion.cours_system.controller;

import com.gestion.cours_system.entity.Utilisateur;
import com.gestion.cours_system.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder; 
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        
        Optional<Utilisateur> userOpt = utilisateurRepository.findByEmail(loginRequest.email);

        if (userOpt.isPresent()) {
            Utilisateur user = userOpt.get();
            
            if (passwordEncoder.matches(loginRequest.password, user.getPassword())) {
                
                if (user.getStatus() == com.gestion.cours_system.entity.Status.EN_ATTENTE) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Account is pending Admin approval.");
                    return ResponseEntity.status(403).body(response);
                }
                
                if (user.getStatus() == com.gestion.cours_system.entity.Status.BANNED) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "This account has been banned.");
                    return ResponseEntity.status(403).body(response);
                }

                return ResponseEntity.ok(user);
            }
        }

        Map<String, String> error = new HashMap<>();
        error.put("message", "Invalid email or password");
        return ResponseEntity.status(401).body(error);
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }
}