package com.gestion.cours_system.repository;

import com.gestion.cours_system.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByCourseId(Long courseId);
    List<Material> findByUploadedById(Long userId);
}