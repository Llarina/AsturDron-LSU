package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.CommentCreateDTO;
import com.dwes.ApiRestBackEnd.dto.CommentResponseDTO;
import com.dwes.ApiRestBackEnd.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/announcement/{announcementId}")
    public List<CommentResponseDTO> getCommentsByAnnouncementId(@PathVariable Integer announcementId) {
        return commentService.getCommentsByAnnouncementId(announcementId);
    }

    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody CommentCreateDTO createDTO) {
        try {
            CommentResponseDTO createdComment = commentService.createComment(createDTO);
            return ResponseEntity.ok(createdComment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al crear el comentario: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable Integer id, @RequestBody CommentCreateDTO updateDTO) {
        try {
            CommentResponseDTO updatedComment = commentService.updateComment(id, updateDTO);
            return ResponseEntity.ok(updatedComment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al actualizar el comentario: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Integer id, @RequestParam String username) {
        try {
            commentService.deleteComment(id, username);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al eliminar el comentario: " + e.getMessage());
        }
    }
} 