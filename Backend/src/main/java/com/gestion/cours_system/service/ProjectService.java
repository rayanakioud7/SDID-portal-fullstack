package com.gestion.cours_system.service;

import com.gestion.cours_system.entity.Project;
import com.gestion.cours_system.entity.Course;
import com.gestion.cours_system.repository.ProjectRepository;
import com.gestion.cours_system.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import com.gestion.cours_system.entity.Utilisateur;
import com.gestion.cours_system.repository.UtilisateurRepository;
import com.gestion.cours_system.entity.Role;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public Project createProject(Project project, Long courseId, Long instructeurId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        Utilisateur user = utilisateurRepository.findById(instructeurId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.INSTRUCTEUR) {
            throw new RuntimeException("PERMISSION DENIED: Only Instructors can create projects.");
        }

        if (!course.getInstructeur().getId().equals(instructeurId)) {
             throw new RuntimeException("PERMISSION DENIED: You are not the instructor of this course.");
        }

        project.setCours(course);
        return projectRepository.save(project);
    }
    
    public List<Project> getProjectsByCourse(Long courseId) {
        return projectRepository.findByCoursId(courseId);
    }
}