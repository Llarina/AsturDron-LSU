package com.dwes.ApiRestBackEnd.repository;

import com.dwes.ApiRestBackEnd.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
