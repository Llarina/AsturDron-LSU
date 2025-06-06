package com.dwes.ApiRestBackEnd.service;


import com.dwes.ApiRestBackEnd.dto.ImageRequestDTO;
import com.dwes.ApiRestBackEnd.model.Image;
import com.dwes.ApiRestBackEnd.model.User;
import com.dwes.ApiRestBackEnd.repository.ImageRepository;
import com.dwes.ApiRestBackEnd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ImageService {
    private final ImageRepository imageRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Autowired
    public ImageService(ImageRepository imageRepository, UserRepository userRepository, FileStorageService fileStorageService) {
        this.imageRepository = imageRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    public ImageRequestDTO mapToRequestDTO(Image image){
        return ImageRequestDTO.builder()
                .id(image.getId())
                .username(image.getUser().getUsername())
                .url(fileStorageService.getFullUrl(image.getImage()))
                .score(image.getScore())
                .build();
    }

    /**
     * Guarda una imagen desde URL (método original)
     */
    public Image saveImage(String username, String url) {
        // Buscamos al usuario, o lanzamos excepción si no existe
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario '" + username + "' no encontrado"));

        // Construimos la entidad y la guardamos
        Image image = new Image();
        image.setUser(user);
        image.setImage(url);

        return imageRepository.save(image);
    }

    /**
     * Guarda una imagen desde archivo subido (nuevo método)
     */
    public Image saveImageFromFile(String username, MultipartFile file) throws IOException {
        // Buscamos al usuario, o lanzamos excepción si no existe
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario '" + username + "' no encontrado"));

        // Guardar el archivo y obtener la URL
        String imageUrl = fileStorageService.storeImage(file);

        // Construimos la entidad y la guardamos
        Image image = new Image();
        image.setUser(user);
        image.setImage(imageUrl);

        return imageRepository.save(image);
    }

    public List<ImageRequestDTO> getAllImages() {
        List<Image> images = imageRepository.findAllWithUser();
        return images.stream().map(this::mapToRequestDTO).collect(Collectors.toList());
    }

    // Eliminar imagen
    public void deleteImage(Long id) {
        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Imagen no encontrada"));
        
        // Eliminar el archivo físico
        fileStorageService.deleteFile(image.getImage());
        
        // Eliminar de la base de datos
        imageRepository.deleteById(id);
    }

    // Puntuar imagen (solo administradores)
    public Image scoreImage(Long imageId, Integer score) {
        if (score < 1 || score > 5) {
            throw new RuntimeException("La puntuación debe estar entre 1 y 5");
        }

        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Imagen no encontrada"));

        Integer oldScore = image.getScore();
        image.setScore(score);
        Image savedImage = imageRepository.save(image);

        // Actualizar score del usuario
        updateUserScore(image.getUser(), oldScore, score);

        return savedImage;
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

