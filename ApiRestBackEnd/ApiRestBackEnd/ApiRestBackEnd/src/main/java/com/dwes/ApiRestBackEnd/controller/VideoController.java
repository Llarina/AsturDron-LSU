package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.VideoRequestDTO;
import com.dwes.ApiRestBackEnd.model.Video;
import com.dwes.ApiRestBackEnd.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // POST: Crear nuevo video
    @PostMapping("/upload/{username}")
    public ResponseEntity<String> uploadVideo(
            @PathVariable String username,
            @RequestParam("miniature") String miniatureUrl,
            @RequestParam("video") String videoUrl
    ) {
        Video vid = videoService.saveVideo(username, miniatureUrl, videoUrl);
        return ResponseEntity.ok("Vídeo subido con ID: " + vid.getId());
    }

    // DELETE: Eliminar video
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long id) {
        videoService.deleteVideo(id);
        return ResponseEntity.noContent().build();
    }
}
