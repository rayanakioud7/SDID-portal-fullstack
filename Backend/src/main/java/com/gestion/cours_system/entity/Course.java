package com.gestion.cours_system.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre; 
    private String description; 

    @Column(unique = true)
    private String code; 

    //Un Utilisateur peut être un Instructeur de plusieurs Cours. Un Cours a un seul Instructeur.
    @ManyToOne
    @JoinColumn(name = "instructeur_id", nullable = false)
    private Utilisateur instructeur;
}