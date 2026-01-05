package com.gestion.cours_system.controller;

import com.gestion.cours_system.entity.Utilisateur;
import com.gestion.cours_system.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
//2ndphase for security before reaching database
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UtilisateurController {

	@Autowired
	private UtilisateurService utilisateurService;

	// POST: Create a new user (Student, Instructor, or Admin)
	@PostMapping
	public Utilisateur createUser(@Valid @RequestBody Utilisateur utilisateur) {
		return utilisateurService.saveUtilisateur(utilisateur);
	}

	// PUT: /api/users/1/status?status=ACTIF
	@PutMapping("/{id}/status")
	public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
		try {
			com.gestion.cours_system.entity.Status newStatus = com.gestion.cours_system.entity.Status.valueOf(status);

			Utilisateur updatedUser = utilisateurService.updateUserStatus(id, newStatus);
			return ResponseEntity.ok(updatedUser);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body("Invalid status value");
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Error updating status");
		}
	}

	// PUT: /api/users/{id}/role?role=INSTRUCTEUR
	@PutMapping("/{id}/role")
	public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestParam String role) {
		try {
			// Convert String to Enum
			com.gestion.cours_system.entity.Role newRole = com.gestion.cours_system.entity.Role.valueOf(role);

			Utilisateur updatedUser = utilisateurService.updateUserRole(id, newRole);
			return ResponseEntity.ok(updatedUser);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body("Invalid role: " + role);
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Error updating role");
		}
	}

	// GET: See all users
	@GetMapping
	public List<Utilisateur> getAllUtilisateurs() {
		return utilisateurService.getAllUtilisateurs();
	}

	// GET: /api/users/{id}
	@GetMapping("/{id}")
	public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable Long id) {
		return utilisateurService.getUtilisateurById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}
}