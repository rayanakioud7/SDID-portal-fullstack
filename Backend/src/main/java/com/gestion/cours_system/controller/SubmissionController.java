package com.gestion.cours_system.controller;

import com.gestion.cours_system.entity.*;
import com.gestion.cours_system.repository.*;
import com.gestion.cours_system.service.SubmissionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @PostMapping("/student/{studentId}/project/{projectId}")
    public Submission submitWork(@PathVariable Long studentId,
            @PathVariable Long projectId,
            @RequestParam String fichierUrl) {

        Utilisateur etudiant = utilisateurRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (etudiant.getRole() != Role.ETUDIANT) {
            throw new RuntimeException("PERMISSION DENIED: Only Students can submit work.");
        }

        return submissionService.saveSubmission(studentId, projectId, fichierUrl);
    }

    // Grade a submission, used by instructor
    @PutMapping("/{submissionId}/grade")
    public Submission gradeSubmission(@PathVariable Long submissionId,
            @RequestParam Double note,
            @RequestParam(required = false) String commentairesInstructeur) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        submission.setNote(note);
        if (commentairesInstructeur != null) {
            submission.setCommentairesInstructeur(commentairesInstructeur);
        }

        return submissionRepository.save(submission);
    }

    // Get submissions by project used by instructor
    @GetMapping("/project/{projectId}")
    public List<Submission> getSubmissionsByProject(@PathVariable Long projectId) {
        return submissionRepository.findByProjetId(projectId);
    }

    // Get submissions by course for filters
    @GetMapping("/course/{courseId}")
    public List<Submission> getSubmissionsByCourse(@PathVariable Long courseId) {
        return submissionRepository.findByProjet_Id(courseId);
    }

    // Get a single submission
    @GetMapping("/{submissionId}")
    public Submission getSubmission(@PathVariable Long submissionId) {
        return submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
    }

    // Get submissions by student and course
    @GetMapping("/student/{studentId}/course/{courseId}")
    public List<Submission> getSubmissionsByStudentAndCourse(@PathVariable Long studentId,
            @PathVariable Long courseId) {
        return submissionService.getSubmissionsByStudentAndCourse(studentId, courseId);
    }

    // Get submissions by student (all submissions for a student)
    @GetMapping("/student/{studentId}")
    public List<Submission> getSubmissionsByStudent(@PathVariable Long studentId) {
        return submissionService.getSubmissionsByStudent(studentId);
    }
}