package com.gestion.cours_system.service;

import com.gestion.cours_system.entity.*;
import com.gestion.cours_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    private final String UPLOAD_DIR = "uploads/materials/";

    public Material uploadMaterial(Long courseId, Long uploadedById, String name, MultipartFile file)
            throws IOException {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Utilisateur uploadedBy = utilisateurRepository.findById(uploadedById)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Files.createDirectories(Paths.get(UPLOAD_DIR));

        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        String fileUrl = UPLOAD_DIR + uniqueFilename;

        // Save file to disk
        Path path = Paths.get(fileUrl);
        Files.copy(file.getInputStream(), path);

        // Create material entity
        Material material = new Material();
        material.setName(name);
        material.setFileUrl("/" + fileUrl);
        material.setFileType(file.getContentType());
        material.setFileSize(file.getSize());
        material.setCourse(course);
        material.setUploadedBy(uploadedBy);
        material.setDownloadCount(0);

        return materialRepository.save(material);
    }

    public List<Material> getMaterialsByCourse(Long courseId) {
        return materialRepository.findByCourseId(courseId);
    }

    public void deleteMaterial(Long materialId) throws IOException {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        Path filePath = Paths.get(material.getFileUrl().substring(1));
        Files.deleteIfExists(filePath);

        materialRepository.delete(material);
    }

    public Material incrementDownloadCount(Long materialId) {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        material.setDownloadCount(material.getDownloadCount() + 1);
        return materialRepository.save(material);
    }
}