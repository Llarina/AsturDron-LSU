package com.dwes.ApiRestBackEnd.repository;

import com.dwes.ApiRestBackEnd.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Integer> {
    
    @Query("SELECT a FROM Announcement a WHERE a.user IS NOT NULL ORDER BY a.createdAt DESC")
    List<Announcement> findAllOrderByCreatedAtDesc();
    
    @Query("SELECT a FROM Announcement a WHERE a.user.username = :username ORDER BY a.createdAt DESC")
    List<Announcement> findByUsernameOrderByCreatedAtDesc(String username);
    
    @Query("SELECT a FROM Announcement a WHERE a.user IS NULL")
    List<Announcement> findOrphanedAnnouncements();
} 