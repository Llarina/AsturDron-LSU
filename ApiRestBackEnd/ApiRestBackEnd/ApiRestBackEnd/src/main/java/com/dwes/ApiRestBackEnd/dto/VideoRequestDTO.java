package com.dwes.ApiRestBackEnd.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VideoRequestDTO {
    public String miniature;
    public String video;
    public String username;
}
