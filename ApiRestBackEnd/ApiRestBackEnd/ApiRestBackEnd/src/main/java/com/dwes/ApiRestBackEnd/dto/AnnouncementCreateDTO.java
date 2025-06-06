package com.dwes.ApiRestBackEnd.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementCreateDTO {
    private String title;
    private String content;
    private String username; // Para identificar el usuario que crea el anuncio
} 