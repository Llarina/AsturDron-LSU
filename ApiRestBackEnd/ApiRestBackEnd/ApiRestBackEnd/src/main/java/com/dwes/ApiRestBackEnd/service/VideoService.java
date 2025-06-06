package com.dwes.ApiRestBackEnd.service;

import com.dwes.ApiRestBackEnd.dto.VideoRequestDTO;
import com.dwes.ApiRestBackEnd.model.User;
import com.dwes.ApiRestBackEnd.model.Video;
import com.dwes.ApiRestBackEnd.repository.UserRepository;
import com.dwes.ApiRestBackEnd.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VideoService {

    private final VideoRepository videoRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Autowired
    public VideoService(VideoRepository videoRepository, UserRepository userRepository, FileStorageService fileStorageService) {
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    public VideoRequestDTO mapToRequestDTO(Video video){
        return VideoRequestDTO.builder()
                .id(video.getId())
                .miniature(fileStorageService.getFullUrl(video.getMiniature()))
                .username(video.getUser().getUsername())
                .video(fileStorageService.getFullUrl(video.getVideo()))
                .score(video.getScore())
                .build();
    }

    /**
     * Guarda un video desde URLs (método original)
     */
    public Video saveVideo(String username, String miniatureUrl, String videoUrl) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("El usuario '" + username + "' no existe. Debes registrarte primero."));

        Video video = new Video();
        video.setUser(user);
        video.setMiniature(miniatureUrl);
        video.setVideo(videoUrl);
        video.setScore(null); // Inicialmente sin puntuación

        return videoRepository.save(video);
    }

    /**
     * Guarda un video desde archivos subidos (nuevo método)
     */
    public Video saveVideoFromFile(String username, MultipartFile videoFile, MultipartFile miniatureFile) throws IOException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("El usuario '" + username + "' no existe. Debes registrarte primero."));

        // Guardar los archivos y obtener las URLs
        String videoUrl = fileStorageService.storeVideo(videoFile);
        String miniatureUrl = fileStorageService.storeImage(miniatureFile);

        Video video = new Video();
        video.setUser(user);
        video.setMiniature(miniatureUrl);
        video.setVideo(videoUrl);
        video.setScore(null); // Inicialmente sin puntuación

        return videoRepository.save(video);
    }

    /**
     * Guarda un video desde archivo con miniatura generada automáticamente (método alternativo)
     */
    public Video saveVideoFromFileOnly(String username, MultipartFile videoFile) throws IOException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("El usuario '" + username + "' no existe. Debes registrarte primero."));

        // Guardar el video
        String videoUrl = fileStorageService.storeVideo(videoFile);

        Video video = new Video();
        video.setUser(user);
        video.setMiniature(null); // Sin miniatura por ahora
        video.setVideo(videoUrl);
        video.setScore(null); // Inicialmente sin puntuación

        return videoRepository.save(video);
    }

    // Obtener todos los videos
    public List<VideoRequestDTO> getAllVideos() {
        List<Video> videos = videoRepository.findAll();
        return videos.stream().map(this::mapToRequestDTO).collect(Collectors.toList());
    }

    // Eliminar video
    public void deleteVideo(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video no encontrado"));
        
        // Eliminar los archivos físicos
        fileStorageService.deleteFile(video.getVideo());
        if (video.getMiniature() != null) {
            fileStorageService.deleteFile(video.getMiniature());
        }
        
        // Eliminar de la base de datos
        videoRepository.deleteById(id);
    }

    // Puntuar video (solo administradores)
    public Video scoreVideo(Long videoId, Integer score) {
        if (score < 1 || score > 5) {
            throw new RuntimeException("La puntuación debe estar entre 1 y 5");
        }

        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video no encontrado"));

        Integer oldScore = video.getScore();
        video.setScore(score);
        Video savedVideo = videoRepository.save(video);

        // Actualizar score del usuario
        updateUserScore(video.getUser(), oldScore, score);

        return savedVideo;
    }

    // Método para actualizar el score del usuario
    private void updateUserScore(User user, Integer oldScore, Integer newScore) {
        int currentScore = user.getScore();
        
        // Quitar puntuación anterior si existía
        if (oldScore != null) {
            currentScore -= oldScore;
        }
        
        // Agregar nueva puntuación
        currentScore += newScore;
        
        user.setScore(currentScore);
        userRepository.save(user);
    }
}
