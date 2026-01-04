package com.gestion.cours_system.controller;

import com.gestion.cours_system.entity.Material;
import com.gestion.cours_system.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @PostMapping("/course/{courseId}/uploader/{uploaderId}")
    public Material uploadMaterial(@PathVariable Long courseId,
                                   @PathVariable Long uploaderId,
                                   @RequestParam String name,
                                   @RequestParam MultipartFile file) throws IOException {
        return materialService.uploadMaterial(courseId, uploaderId, name, file);
    }

    @GetMapping("/course/{courseId}")
    public List<Material> getMaterialsByCourse(@PathVariable Long courseId) {
        return materialService.getMaterialsByCourse(courseId);
    }

    @GetMapping("/{materialId}/download")
    public ResponseEntity<Resource> downloadMaterial(@PathVariable Long materialId) throws IOException {
        Material material = materialService.incrementDownloadCount(materialId);
        
        Path filePath = Paths.get(material.getFileUrl().substring(1)); // Remove leading '/'
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() || resource.isReadable()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + material.getName() + "\"")
                    .body(resource);
        } else {
            throw new RuntimeException("Could not read the file!");
        }
    }

    @DeleteMapping("/{materialId}")
    public ResponseEntity<?> deleteMaterial(@PathVariable Long materialId) {
        try {
            materialService.deleteMaterial(materialId);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error deleting material: " + e.getMessage());
        }
    }
}