package com.dwes.ApiRestBackEnd.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VideoRequestDTO {
    public Long id;
    public String miniature;
    public String video;
    public String username;
    public Integer score; // Puntuación del 1 al 5, null si no ha sido puntuada
}
