package com.dwes.ApiRestBackEnd.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponseDTO {
    private Integer id;
    private String content;
    private String username;
    private Integer announcementId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 