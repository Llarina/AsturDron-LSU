package com.dwes.ApiRestBackEnd.service;

import com.dwes.ApiRestBackEnd.dto.CommentCreateDTO;
import com.dwes.ApiRestBackEnd.dto.CommentResponseDTO;
import com.dwes.ApiRestBackEnd.model.Announcement;
import com.dwes.ApiRestBackEnd.model.Comment;
import com.dwes.ApiRestBackEnd.model.User;
import com.dwes.ApiRestBackEnd.repository.AnnouncementRepository;
import com.dwes.ApiRestBackEnd.repository.CommentRepository;
import com.dwes.ApiRestBackEnd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final AnnouncementRepository announcementRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository, 
                         UserRepository userRepository,
                         AnnouncementRepository announcementRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.announcementRepository = announcementRepository;
    }

    public List<CommentResponseDTO> getCommentsByAnnouncementId(Integer announcementId) {
        List<Comment> comments = commentRepository.findByAnnouncementIdOrderByCreatedAtAsc(announcementId);
        return comments.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public CommentResponseDTO createComment(CommentCreateDTO createDTO) {
        User user = userRepository.findByUsername(createDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + createDTO.getUsername()));

        Announcement announcement = announcementRepository.findById(createDTO.getAnnouncementId())
                .orElseThrow(() -> new RuntimeException("Anuncio no encontrado con ID: " + createDTO.getAnnouncementId()));

        Comment comment = new Comment();
        comment.setContent(createDTO.getContent());
        comment.setUser(user);
        comment.setAnnouncement(announcement);

        Comment savedComment = commentRepository.save(comment);
        return mapToResponseDTO(savedComment);
    }

    public CommentResponseDTO updateComment(Integer id, CommentCreateDTO updateDTO) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado con ID: " + id));

        // Verificar que el usuario que actualiza es el mismo que creó el comentario
        if (!comment.getUser().getUsername().equals(updateDTO.getUsername())) {
            throw new RuntimeException("No tienes permisos para actualizar este comentario");
        }

        comment.setContent(updateDTO.getContent());

        Comment savedComment = commentRepository.save(comment);
        return mapToResponseDTO(savedComment);
    }

    public void deleteComment(Integer id, String username) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado con ID: " + id));

        // Verificar que el usuario que elimina es el mismo que creó el comentario o es admin
        if (!comment.getUser().getUsername().equals(username) && !"admin".equals(username)) {
            throw new RuntimeException("No tienes permisos para eliminar este comentario");
        }

        commentRepository.delete(comment);
    }

    private CommentResponseDTO mapToResponseDTO(Comment comment) {
        return CommentResponseDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .username(comment.getUser().getUsername())
                .announcementId(comment.getAnnouncement().getId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
} 