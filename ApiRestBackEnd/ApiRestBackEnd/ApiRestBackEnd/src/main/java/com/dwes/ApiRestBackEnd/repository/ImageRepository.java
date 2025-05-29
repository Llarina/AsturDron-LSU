package com.dwes.ApiRestBackEnd.repository;

import com.dwes.ApiRestBackEnd.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {
    @Query("SELECT i FROM Image i JOIN FETCH i.user")
    List<Image> findAllWithUser();
}

