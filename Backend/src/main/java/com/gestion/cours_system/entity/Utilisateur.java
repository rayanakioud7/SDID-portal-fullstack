package com.gestion.cours_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "utilisateur")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "date_inscription", updatable = false)
    private LocalDateTime dateInscription;

    @PrePersist
    protected void onCreate() {
        this.dateInscription = LocalDateTime.now();
        if (this.status == null) {
            this.status = Status.EN_ATTENTE;
        }
    }
}