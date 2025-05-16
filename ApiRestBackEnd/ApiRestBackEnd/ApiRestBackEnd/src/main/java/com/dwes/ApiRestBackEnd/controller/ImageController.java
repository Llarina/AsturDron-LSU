package com.dwes.ApiRestBackEnd.controller;


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
public class ImageController {

    @Autowired
    private ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("username") String username, @RequestParam("file") MultipartFile file) throws IOException {
        Image image = imageService.saveImage(username, file);
        return ResponseEntity.ok("Imagen subida con ID: " + image.getId());
    }


    @GetMapping("")
    public List<Image> getAllImages() {
         return imageService.getAllImages();
    }

}
