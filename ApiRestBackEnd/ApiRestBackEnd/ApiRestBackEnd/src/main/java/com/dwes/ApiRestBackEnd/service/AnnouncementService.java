package com.dwes.ApiRestBackEnd.service;

import com.dwes.ApiRestBackEnd.dto.AnnouncementCreateDTO;
import com.dwes.ApiRestBackEnd.dto.AnnouncementResponseDTO;
import com.dwes.ApiRestBackEnd.model.Announcement;
import com.dwes.ApiRestBackEnd.model.User;
import com.dwes.ApiRestBackEnd.repository.AnnouncementRepository;
import com.dwes.ApiRestBackEnd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    @Autowired
    public AnnouncementService(AnnouncementRepository announcementRepository, UserRepository userRepository) {
        this.announcementRepository = announcementRepository;
        this.userRepository = userRepository;
    }

    public List<AnnouncementResponseDTO> getAllAnnouncements() {
        List<Announcement> announcements = announcementRepository.findAllOrderByCreatedAtDesc();
        return announcements.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<AnnouncementResponseDTO> getAnnouncementsByUsername(String username) {
        List<Announcement> announcements = announcementRepository.findByUsernameOrderByCreatedAtDesc(username);
        return announcements.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public AnnouncementResponseDTO createAnnouncement(AnnouncementCreateDTO createDTO) {
        User user = userRepository.findByUsername(createDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + createDTO.getUsername()));

        Announcement announcement = new Announcement();
        announcement.setTitle(createDTO.getTitle());
        announcement.setContent(createDTO.getContent());
        announcement.setUser(user);

        Announcement savedAnnouncement = announcementRepository.save(announcement);
        return mapToResponseDTO(savedAnnouncement);
    }

    public AnnouncementResponseDTO updateAnnouncement(Integer id, AnnouncementCreateDTO updateDTO) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anuncio no encontrado con ID: " + id));

        // Verificar que el usuario que actualiza es el mismo que creó el anuncio
        if (!announcement.getUser().getUsername().equals(updateDTO.getUsername())) {
            throw new RuntimeException("No tienes permisos para actualizar este anuncio");
        }

        announcement.setTitle(updateDTO.getTitle());
        announcement.setContent(updateDTO.getContent());

        Announcement savedAnnouncement = announcementRepository.save(announcement);
        return mapToResponseDTO(savedAnnouncement);
    }

    public void deleteAnnouncement(Integer id, String username) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anuncio no encontrado con ID: " + id));

        // Verificar que el usuario que elimina es el mismo que creó el anuncio o es admin
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));
        
        boolean isOwner = announcement.getUser().getUsername().equals(username);
        boolean isAdmin = "admin".equals(username); // Puedes cambiar esto por un rol de usuario si lo tienes
        
        if (!isOwner && !isAdmin) {
            throw new RuntimeException("No tienes permisos para eliminar este anuncio");
        }

        announcementRepository.delete(announcement);
    }

    private AnnouncementResponseDTO mapToResponseDTO(Announcement announcement) {
        return AnnouncementResponseDTO.builder()
                .id(announcement.getId())
                .title(announcement.getTitle())
                .content(announcement.getContent())
                .username(announcement.getUser().getUsername())
                .createdAt(announcement.getCreatedAt())
                .updatedAt(announcement.getUpdatedAt())
                .commentCount(announcement.getComments() != null ? (long) announcement.getComments().size() : 0L)
                .build();
    }
} 