package com.dwes.ApiRestBackEnd.repository;

import com.dwes.ApiRestBackEnd.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    
    @Query("SELECT c FROM Comment c WHERE c.announcement.id = :announcementId ORDER BY c.createdAt ASC")
    List<Comment> findByAnnouncementIdOrderByCreatedAtAsc(Integer announcementId);
    
    @Query("SELECT c FROM Comment c WHERE c.user.username = :username ORDER BY c.createdAt DESC")
    List<Comment> findByUsernameOrderByCreatedAtDesc(String username);
} 