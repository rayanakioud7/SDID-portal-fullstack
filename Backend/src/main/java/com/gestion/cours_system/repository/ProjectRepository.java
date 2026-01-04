package com.gestion.cours_system.repository;

import com.gestion.cours_system.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    List<Project> findByCoursId(Long coursId);
}