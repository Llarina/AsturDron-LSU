package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.ImageRequestDTO;
import com.dwes.ApiRestBackEnd.model.Image;
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

    @PostMapping("/upload/{username}")
    public ResponseEntity<String> uploadImage(
            @PathVariable String username,
            @RequestParam("url") String url
    ) {
        Image image = imageService.saveImage(username, url);
        return ResponseEntity.ok("Imagen subida con ID: " + image.getId());
    }

    @GetMapping("")
    public List<ImageRequestDTO> getAllImages() {
         return imageService.getAllImages();
    }
}
