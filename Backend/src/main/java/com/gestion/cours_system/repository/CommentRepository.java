package com.gestion.cours_system.repository;

import com.gestion.cours_system.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    // Find all comments for a specific course
    List<Comment> findByCoursId(Long coursId);
    
    // Find all comments for a specific submission
    List<Comment> findBySoumissionId(Long soumissionId);
}