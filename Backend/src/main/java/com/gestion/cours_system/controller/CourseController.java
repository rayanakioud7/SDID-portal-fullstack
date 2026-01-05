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

    // POST: Create a course
    @PostMapping("/instructeur/{instructeurId}")
    public Course createCourse(@RequestBody Course course, @PathVariable Long instructeurId) {
        return courseService.createCourse(course, instructeurId);
    }

    // GET: List all courses to be shown for either student or professor
    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    // GET: Get only courses taught by a specific instructor, used for filters
    @GetMapping("/instructeur/{instructeurId}")
    public List<Course> getCoursesByInstructor(@PathVariable Long instructeurId) {
        return courseService.getCoursesByInstructor(instructeurId);
    }

    // Get a single course by ID
    @GetMapping("/{courseId}")
    public Course getCourseById(@PathVariable Long courseId) {
        return courseService.getCourseById(courseId);
    }
}