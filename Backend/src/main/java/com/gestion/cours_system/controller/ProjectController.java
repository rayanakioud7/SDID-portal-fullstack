package com.gestion.cours_system.controller;

import com.gestion.cours_system.entity.Project;
import com.gestion.cours_system.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/course/{courseId}/instructor/{instructeurId}")
    public Project createProject(@Valid @RequestBody Project project, 
                                 @PathVariable Long courseId, 
                                 @PathVariable Long instructeurId) { 
        return projectService.createProject(project, courseId, instructeurId);
    }

    @GetMapping("/course/{courseId}")
    public List<Project> getProjectsByCourse(@PathVariable Long courseId) {
        return projectService.getProjectsByCourse(courseId);
    }
}