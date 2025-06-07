package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.AnnouncementCreateDTO;
import com.dwes.ApiRestBackEnd.dto.AnnouncementResponseDTO;
import com.dwes.ApiRestBackEnd.dto.ErrorResponseDTO;
import com.dwes.ApiRestBackEnd.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @Autowired
    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    public ResponseEntity<?> getAllAnnouncements(HttpServletRequest request) {
        try {
            List<AnnouncementResponseDTO> announcements = announcementService.getAllAnnouncements();
            return ResponseEntity.ok(announcements);
        } catch (Exception e) {
            e.printStackTrace(); // Para debugging
            ErrorResponseDTO errorResponse = ErrorResponseDTO.create(
                "Internal Server Error",
                "Error al obtener los anuncios: " + e.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                request.getRequestURI()
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/user/{username}")
    public List<AnnouncementResponseDTO> getAnnouncementsByUsername(@PathVariable String username) {
        return announcementService.getAnnouncementsByUsername(username);
    }

    @PostMapping
    public ResponseEntity<?> createAnnouncement(@RequestBody AnnouncementCreateDTO createDTO, HttpServletRequest request) {
        try {
            AnnouncementResponseDTO createdAnnouncement = announcementService.createAnnouncement(createDTO);
            return ResponseEntity.ok(createdAnnouncement);
        } catch (Exception e) {
            ErrorResponseDTO errorResponse = ErrorResponseDTO.create(
                "Bad Request",
                "Error al crear el anuncio: " + e.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                request.getRequestURI()
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAnnouncement(@PathVariable Integer id, @RequestBody AnnouncementCreateDTO updateDTO, HttpServletRequest request) {
        try {
            AnnouncementResponseDTO updatedAnnouncement = announcementService.updateAnnouncement(id, updateDTO);
            return ResponseEntity.ok(updatedAnnouncement);
        } catch (Exception e) {
            ErrorResponseDTO errorResponse = ErrorResponseDTO.create(
                "Bad Request",
                "Error al actualizar el anuncio: " + e.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                request.getRequestURI()
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Integer id, @RequestParam String username, HttpServletRequest request) {
        try {
            announcementService.deleteAnnouncement(id, username);
            return ResponseEntity.ok().body("{\"message\": \"Anuncio eliminado exitosamente\"}");
        } catch (Exception e) {
            ErrorResponseDTO errorResponse = ErrorResponseDTO.create(
                "Bad Request",
                "Error al eliminar el anuncio: " + e.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                request.getRequestURI()
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    @DeleteMapping("/cleanup/orphaned")
    public ResponseEntity<?> cleanupOrphanedAnnouncements(HttpServletRequest request) {
        try {
            int deletedCount = announcementService.cleanOrphanedAnnouncements();
            return ResponseEntity.ok().body("{\"message\": \"Eliminados " + deletedCount + " anuncios huérfanos\", \"deletedCount\": " + deletedCount + "}");
        } catch (Exception e) {
            ErrorResponseDTO errorResponse = ErrorResponseDTO.create(
                "Internal Server Error",
                "Error al limpiar anuncios huérfanos: " + e.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                request.getRequestURI()
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
} 