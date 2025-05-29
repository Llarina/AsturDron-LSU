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
    private  final ImageRepository imageRepository;
    private  final UserRepository userRepository;

    @Autowired
    public ImageService(ImageRepository imageRepository, UserRepository userRepository) {
        this.imageRepository = imageRepository;
        this.userRepository = userRepository;
    }

    public ImageRequestDTO mapToRequestDTO(Image image){
        return ImageRequestDTO.builder()
                .username(image.getUser().getUsername())
                .url(image.getImage())
                .build();
    }

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


    public List<ImageRequestDTO> getAllImages() {

        List<Image> images = imageRepository.findAllWithUser();

         return images.stream().map(this::mapToRequestDTO).collect(Collectors.toList());
    }

}

