package com.dwes.ApiRestBackEnd.repository;

import com.dwes.ApiRestBackEnd.model.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoRepository extends JpaRepository<Video,Long> {
}
