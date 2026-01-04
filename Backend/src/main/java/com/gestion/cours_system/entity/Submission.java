package com.gestion.cours_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
//Une SoumissionÉtudiant est faite par un Étudiant pour un Projet/Devoir/Thèse. prevent duplicate submissions from the same student for the same project 
@Table(uniqueConstraints = {
	    @UniqueConstraint(columnNames = {"etudiant_id", "projet_id"})
	})
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dateSoumission; 
    private String fichierUrl;
    private Double note; 
    private String commentairesInstructeur; 

    // Fait par un étudiant soumis plusieur project
    @ManyToOne
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Utilisateur etudiant;

    // Pour un projet spécifique 
    @ManyToOne
    @JoinColumn(name = "projet_id", nullable = false)
    private Project projet;
}