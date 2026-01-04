package com.gestion.cours_system.service;

import com.gestion.cours_system.entity.Utilisateur;
import com.gestion.cours_system.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder; // Import this
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Utilisateur saveUtilisateur(Utilisateur utilisateur) {
        // pssword encrytption
        String password = utilisateur.getPassword();
        String encodedPassword = passwordEncoder.encode(password); 
        utilisateur.setPassword(encodedPassword);
        
        return utilisateurRepository.save(utilisateur);
    }
    
    public Utilisateur updateUserStatus(Long id, com.gestion.cours_system.entity.Status newStatus) {
        Utilisateur user = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setStatus(newStatus);
        return utilisateurRepository.save(user);
    }
    

    public Utilisateur updateUserRole(Long id, com.gestion.cours_system.entity.Role newRole) {
        Utilisateur user = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setRole(newRole);
        return utilisateurRepository.save(user);
    }

    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    public Optional<Utilisateur> getUtilisateurById(Long id) {
        return utilisateurRepository.findById(id);
    }
}