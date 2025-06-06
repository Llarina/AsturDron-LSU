package com.dwes.ApiRestBackEnd.repository;

import com.dwes.ApiRestBackEnd.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Integer> {
    
    @Query("SELECT DISTINCT a FROM Announcement a LEFT JOIN FETCH a.comments ORDER BY a.createdAt DESC")
    List<Announcement> findAllOrderByCreatedAtDesc();
    
    @Query("SELECT DISTINCT a FROM Announcement a LEFT JOIN FETCH a.comments WHERE a.user.username = :username ORDER BY a.createdAt DESC")
    List<Announcement> findByUsernameOrderByCreatedAtDesc(String username);
} 