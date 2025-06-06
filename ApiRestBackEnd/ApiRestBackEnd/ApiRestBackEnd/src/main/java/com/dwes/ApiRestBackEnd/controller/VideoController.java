package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.VideoRequestDTO;
import com.dwes.ApiRestBackEnd.dto.UploadResponseDTO;
import com.dwes.ApiRestBackEnd.model.Video;
import com.dwes.ApiRestBackEnd.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/Videos")
@CrossOrigin(origins = "*")
public class VideoController {
    private final VideoService videoService;

    @Autowired
    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    // GET: Todos los videos
    @GetMapping
    public List<VideoRequestDTO> getAllVideos() {
        return videoService.getAllVideos();
    }

    /**
     * Subir video desde URLs (método original)
     */
    @PostMapping("/upload/{username}")
    public ResponseEntity<UploadResponseDTO> uploadVideo(
            @PathVariable String username,
            @RequestParam("miniature") String miniatureUrl,
            @RequestParam("video") String videoUrl
    ) {
        try {
            Video vid = videoService.saveVideo(username, miniatureUrl, videoUrl);
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(true)
                    .message("Video subido exitosamente")
                    .id(vid.getId())
                    .url(videoUrl)
                    .build();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(false)
                    .message("Error al subir video: " + e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Subir video desde archivos (con miniatura)
     */
    @PostMapping("/upload-file/{username}")
    public ResponseEntity<UploadResponseDTO> uploadVideoFile(
            @PathVariable String username,
            @RequestParam("videoFile") MultipartFile videoFile,
            @RequestParam("miniatureFile") MultipartFile miniatureFile
    ) {
        try {
            if (videoFile.isEmpty()) {
                UploadResponseDTO response = UploadResponseDTO.builder()
                        .success(false)
                        .message("Error: Debe seleccionar un archivo de video")
                        .build();
                return ResponseEntity.badRequest().body(response);
            }
            if (miniatureFile.isEmpty()) {
                UploadResponseDTO response = UploadResponseDTO.builder()
                        .success(false)
                        .message("Error: Debe seleccionar una imagen de miniatura")
                        .build();
                return ResponseEntity.badRequest().body(response);
            }

            Video video = videoService.saveVideoFromFile(username, videoFile, miniatureFile);
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(true)
                    .message("Video subido exitosamente")
                    .id(video.getId())
                    .url(video.getVideo()) // Ruta relativa almacenada
                    .build();
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(false)
                    .message("Error al procesar los archivos: " + e.getMessage())
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

    // DELETE: Eliminar video
    @DeleteMapping("/{id}")
    public ResponseEntity<UploadResponseDTO> deleteVideo(@PathVariable Long id) {
        try {
            videoService.deleteVideo(id);
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(true)
                    .message("Video eliminado correctamente")
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

    // PUT: Puntuar video
    @PutMapping("/{id}/score")
    public ResponseEntity<UploadResponseDTO> scoreVideo(
            @PathVariable Long id,
            @RequestParam Integer score
    ) {
        try {
            videoService.scoreVideo(id, score);
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(true)
                    .message("Video puntuado correctamente con " + score + " puntos")
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
