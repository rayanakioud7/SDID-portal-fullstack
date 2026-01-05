package com.gestion.cours_system.repository;

import com.gestion.cours_system.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {

    // Finds all courses taught by a specific instructor
    List<Course> findByInstructeurId(Long instructeurId);

    // Finds a course by its unique code (exemple: MATH101)
    Optional<Course> findByCode(String code);
}