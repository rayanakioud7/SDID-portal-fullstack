package com.gestion.cours_system.controller;

import com.gestion.cours_system.entity.Comment;
import com.gestion.cours_system.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // POST: Comment on a Course
    @PostMapping("/course/{courseId}/author/{authorId}")
    public Comment addCommentToCourse(@PathVariable Long courseId,
            @PathVariable Long authorId,
            @RequestBody String texte) {
        return commentService.addCommentToCourse(courseId, authorId, texte);
    }

    // POST: Comment on a Submission (Feedback), par exemple: great work
    @PostMapping("/submission/{submissionId}/author/{authorId}")
    public Comment addCommentToSubmission(@PathVariable Long submissionId,
            @PathVariable Long authorId,
            @RequestBody String texte) {
        return commentService.addCommentToSubmission(submissionId, authorId, texte);
    }

    // GET: See comments in modules
    @GetMapping("/course/{courseId}")
    public List<Comment> getCommentsByCourse(@PathVariable Long courseId) {
        return commentService.getCommentsByCourse(courseId);
    }
}