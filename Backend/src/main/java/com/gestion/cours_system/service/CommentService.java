package com.gestion.cours_system.service;

import com.gestion.cours_system.entity.*;
import com.gestion.cours_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private SubmissionRepository submissionRepository;

    // Comment on a Course 
    public Comment addCommentToCourse(Long courseId, Long auteurId, String texte) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        Utilisateur auteur = utilisateurRepository.findById(auteurId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setTexte(texte);
        comment.setDateCommentaire(LocalDateTime.now());
        comment.setAuteur(auteur);
        comment.setCours(course); 
        comment.setSoumission(null); 
        
        return commentRepository.save(comment);
    }

    public Comment addCommentToSubmission(Long submissionId, Long auteurId, String texte) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        
        Utilisateur auteur = utilisateurRepository.findById(auteurId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setTexte(texte);
        comment.setDateCommentaire(LocalDateTime.now());
        comment.setAuteur(auteur);
        comment.setSoumission(submission); 
        comment.setCours(null); 
        
        return commentRepository.save(comment);
    }

    // Retrieve comments for a course
    public List<Comment> getCommentsByCourse(Long courseId) {
        return commentRepository.findByCoursId(courseId);
    }

    // Retrieve comments for a submission
    public List<Comment> getCommentsBySubmission(Long submissionId) {
        return commentRepository.findBySoumissionId(submissionId);
    }
}