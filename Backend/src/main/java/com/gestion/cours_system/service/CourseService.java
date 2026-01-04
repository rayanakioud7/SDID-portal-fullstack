package com.gestion.cours_system.service;

import com.gestion.cours_system.entity.Course;
import com.gestion.cours_system.entity.Utilisateur;
import com.gestion.cours_system.entity.Role;
import com.gestion.cours_system.repository.CourseRepository;
import com.gestion.cours_system.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public Course createCourse(Course course, Long instructeurId) {
        Utilisateur instructeur = utilisateurRepository.findById(instructeurId)
            .orElseThrow(() -> new RuntimeException("Instructeur not found"));

        if (instructeur.getRole() != Role.INSTRUCTEUR) {
            throw new RuntimeException("Error: Only Instructors can create courses.");
        }

        course.setInstructeur(instructeur);
        return courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    public List<Course> getCoursesByInstructor(Long id) {
         return courseRepository.findByInstructeurId(id); 
    }
    
    public Course getCourseById(Long id) {
    return courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }
}