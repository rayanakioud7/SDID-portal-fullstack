package com.gestion.cours_system.controller;

import com.gestion.cours_system.entity.Submission;
import com.gestion.cours_system.entity.*;
import com.gestion.cours_system.repository.*;
import com.gestion.cours_system.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;
    private UtilisateurRepository utilisateurRepository;
    
    @PostMapping("/student/{studentId}/project/{projectId}")
    public Submission submitWork(@PathVariable Long etudiantId, 
                                 @PathVariable Long projectId, 
                                 @RequestParam String fichierUrl) {
    	
    	Utilisateur etudiant = utilisateurRepository.findById(etudiantId)
    	        .orElseThrow(() -> new RuntimeException("User not found"));

    	    
    	    if (etudiant.getRole() != Role.ETUDIANT) {
    	        throw new RuntimeException("PERMISSION DENIED: Only Students can submit work.");
    	    }
    	    
        return submissionService.saveSubmission(etudiantId, projectId, fichierUrl);
    }
}