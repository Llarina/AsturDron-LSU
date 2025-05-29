package com.dwes.ApiRestBackEnd.service;

import com.dwes.ApiRestBackEnd.dto.VideoRequestDTO;
import com.dwes.ApiRestBackEnd.model.User;
import com.dwes.ApiRestBackEnd.model.Video;
import com.dwes.ApiRestBackEnd.repository.UserRepository;
import com.dwes.ApiRestBackEnd.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VideoService {

    private final VideoRepository videoRepository;
    private final UserRepository userRepository;

    @Autowired
    public VideoService(VideoRepository videoRepository, UserRepository userRepository) {
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
    }

    public VideoRequestDTO mapToRequestDTO(Video video){
        return VideoRequestDTO.builder()
                .miniature(video.getMiniature())
                .username(video.getUser().getUsername())
                .video(video.getVideo())
                .build();
    }

    public Video saveVideo(String username, String miniatureUrl, String videoUrl) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario '" + username + "' no encontrado"));

        Video video = new Video();
        video.setUser(user);
        video.setMiniature(miniatureUrl);
        video.setVideo(videoUrl);

        return videoRepository.save(video);
    }

    // Obtener todos los videos
    public List<VideoRequestDTO> getAllVideos() {

        List<Video> videos =  videoRepository.findAll();

        return videos.stream().map(this::mapToRequestDTO).collect(Collectors.toList());
    }

    // Eliminar video
    public void deleteVideo(Long id) {
        if (!videoRepository.existsById(id)) {
            throw new RuntimeException("Video no encontrado");
        }
        videoRepository.deleteById(id);
    }

}
