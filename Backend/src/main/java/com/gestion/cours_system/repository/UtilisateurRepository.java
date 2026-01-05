package com.gestion.cours_system.repository;

import com.gestion.cours_system.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    // query: "Find a user where the email equals X"
    Optional<Utilisateur> findByEmail(String email);

    boolean existsByEmail(String email);
}