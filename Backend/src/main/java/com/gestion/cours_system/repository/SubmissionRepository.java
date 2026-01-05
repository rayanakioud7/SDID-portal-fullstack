package com.gestion.cours_system.repository;

import com.gestion.cours_system.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    // Check if this student has already submitted to this project
    boolean existsByEtudiantIdAndProjetId(Long etudiantId, Long projetId);

    // Get all submissions for a specific project , For the Instructor to grade
    List<Submission> findByProjetId(Long projetId);

    // Get all submissions made by a specific student, For the Student to see their
    // grades
    List<Submission> findByEtudiantId(Long etudiantId);

    List<Submission> findByProjet_Id(Long courseId);
}