package com.gestion.cours_system.service;

import com.gestion.cours_system.entity.*;
import com.gestion.cours_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    @Autowired
    private ProjectRepository projectRepository;

    public Submission saveSubmission(Long etudiantId, Long projectId, String fichierUrl) {
        Utilisateur etudiant = utilisateurRepository.findById(etudiantId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // role Etudiant?
        if (etudiant.getRole() != Role.ETUDIANT) {
            throw new RuntimeException("Error: Only students can submit work.");
        }

        // Check if Project exists
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Did they already submit?
        if (submissionRepository.existsByEtudiantIdAndProjetId(etudiantId, projectId)) {
            throw new RuntimeException("Error: You have already submitted this project.");
        }

        // Create and Save
        Submission submission = new Submission();
        submission.setEtudiant(etudiant);
        submission.setProjet(project);
        submission.setFichierUrl(fichierUrl);
        submission.setDateSoumission(LocalDateTime.now());

        return submissionRepository.save(submission);
    }

    public List<Submission> getSubmissionsByStudentAndCourse(Long studentId, Long courseId) {
        return submissionRepository.findByEtudiantId(studentId).stream()
                .filter(submission -> submission.getProjet().getCours().getId().equals(courseId))
                .collect(Collectors.toList());
    }

    public List<Submission> getSubmissionsByStudent(Long studentId) {
        return submissionRepository.findByEtudiantId(studentId);
    }

}