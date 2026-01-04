package com.gestion.cours_system.controller;

import com.gestion.cours_system.entity.Course;
import com.gestion.cours_system.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // POST: Create a course (Must provide Instructor ID in URL)
    // Example: POST /api/courses/instructeur/1
    @PostMapping("/instructeur/{instructeurId}")
    public Course createCourse(@RequestBody Course course, @PathVariable Long instructeurId) {
        return courseService.createCourse(course, instructeurId);
    }

    // GET: List all courses
    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }
}