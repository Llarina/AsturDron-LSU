package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.AnnouncementCreateDTO;
import com.dwes.ApiRestBackEnd.dto.AnnouncementResponseDTO;
import com.dwes.ApiRestBackEnd.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public List<AnnouncementResponseDTO> getAllAnnouncements() {
        return announcementService.getAllAnnouncements();
    }

    @GetMapping("/user/{username}")
    public List<AnnouncementResponseDTO> getAnnouncementsByUsername(@PathVariable String username) {
        return announcementService.getAnnouncementsByUsername(username);
    }

    @PostMapping
    public ResponseEntity<?> createAnnouncement(@RequestBody AnnouncementCreateDTO createDTO) {
        try {
            AnnouncementResponseDTO createdAnnouncement = announcementService.createAnnouncement(createDTO);
            return ResponseEntity.ok(createdAnnouncement);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al crear el anuncio: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAnnouncement(@PathVariable Integer id, @RequestBody AnnouncementCreateDTO updateDTO) {
        try {
            AnnouncementResponseDTO updatedAnnouncement = announcementService.updateAnnouncement(id, updateDTO);
            return ResponseEntity.ok(updatedAnnouncement);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al actualizar el anuncio: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Integer id, @RequestParam String username) {
        try {
            announcementService.deleteAnnouncement(id, username);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al eliminar el anuncio: " + e.getMessage());
        }
    }
} 