package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.ImageRequestDTO;
import com.dwes.ApiRestBackEnd.dto.UploadResponseDTO;
import com.dwes.ApiRestBackEnd.model.Image;
import com.dwes.ApiRestBackEnd.model.User;
import com.dwes.ApiRestBackEnd.repository.UserRepository;
import com.dwes.ApiRestBackEnd.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/images")
@CrossOrigin(origins = "*")
public class ImageController {

    @Autowired
    private ImageService imageService;
    
    @Autowired
    private UserRepository userRepository;

    /**
     * Subir imagen desde URL (método original)
     */
    @PostMapping("/upload/{username}")
    public ResponseEntity<UploadResponseDTO> uploadImage(
            @PathVariable String username,
            @RequestParam("url") String url
    ) {
        try {
            Image image = imageService.saveImage(username, url);
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(true)
                    .message("Imagen subida exitosamente")
                    .id(image.getId())
                    .url(url)
                    .build();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(false)
                    .message("Error al subir imagen: " + e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Subir imagen desde archivo local (nuevo método)
     */
    @PostMapping("/upload-file/{username}")
    public ResponseEntity<UploadResponseDTO> uploadImageFile(
            @PathVariable String username,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            if (file.isEmpty()) {
                UploadResponseDTO response = UploadResponseDTO.builder()
                        .success(false)
                        .message("Error: Debe seleccionar un archivo")
                        .build();
                return ResponseEntity.badRequest().body(response);
            }

            Image image = imageService.saveImageFromFile(username, file);
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(true)
                    .message("Imagen subida exitosamente")
                    .id(image.getId())
                    .url(image.getImage()) // Esta es la ruta relativa almacenada
                    .build();
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(false)
                    .message("Error al procesar el archivo: " + e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (RuntimeException e) {
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(false)
                    .message("Error: " + e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("")
    public List<ImageRequestDTO> getAllImages() {
         return imageService.getAllImages();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UploadResponseDTO> deleteImage(@PathVariable Long id) {
        try {
            imageService.deleteImage(id);
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(true)
                    .message("Imagen eliminada correctamente")
                    .build();
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(false)
                    .message("Error: " + e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    // PUT: Puntuar imagen
    @PutMapping("/{id}/score")
    public ResponseEntity<UploadResponseDTO> scoreImage(
            @PathVariable Long id,
            @RequestParam Integer score
    ) {
        try {
            imageService.scoreImage(id, score);
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(true)
                    .message("Imagen puntuada correctamente con " + score + " puntos")
                    .build();
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(false)
                    .message("Error: " + e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(response);
        }
    }
}
