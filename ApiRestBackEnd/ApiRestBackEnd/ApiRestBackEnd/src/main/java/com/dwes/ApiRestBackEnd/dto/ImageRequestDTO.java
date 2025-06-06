package com.dwes.ApiRestBackEnd.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ImageRequestDTO {
    public Long id;
    public String username;
    public String url;
    public Integer score; // Puntuación del 1 al 5, null si no ha sido puntuada
}