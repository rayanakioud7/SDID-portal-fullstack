package com.gestion.cours_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String texte;

    private LocalDateTime dateCommentaire; 

    // Un Utilisateur peut être l'Auteur de plusieurs Commentaires.
    @ManyToOne
    @JoinColumn(name = "auteur_id", nullable = false)
    private Utilisateur auteur;

    // Un Commentaire peut être lié à une SoumissionÉtudiant
    @ManyToOne
    @JoinColumn(name = "soumission_id")
    private Submission soumission;

    //  ou à un Cours
    @ManyToOne
    @JoinColumn(name = "cours_id")
    private Course cours;
}