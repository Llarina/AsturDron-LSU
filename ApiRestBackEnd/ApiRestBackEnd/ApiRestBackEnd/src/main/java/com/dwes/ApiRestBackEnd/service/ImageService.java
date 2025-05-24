package com.dwes.ApiRestBackEnd.service;


import com.dwes.ApiRestBackEnd.model.Image;
import com.dwes.ApiRestBackEnd.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ImageService {

    @Autowired
    private ImageRepository imageRepository;

    public Image saveImage(String username, String url) throws IOException {
        Image image = new Image();
        image.setUsername(username);
        image.setUrl(url);
        return imageRepository.save(image);
    }


    public List<Image> getAllImages() {
         return imageRepository.findAll();
    }

}

