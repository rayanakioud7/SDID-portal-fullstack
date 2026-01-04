package com.gestion.cours_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import jakarta.validation.constraints.*;

@Entity
@Data
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String titre;
    
    private String description; 
    
    @Future(message = "Deadline must be in the future")
    private LocalDate dateLimite; 

    //Un Cours peut avoir plusieurs Projet/Devoir/Thèse.Un Projet/Devoir/Thèse appartient à un Cours.
    @ManyToOne
    @JoinColumn(name = "cours_id", nullable = false)
    private Course cours;
}