package com.dwes.ApiRestBackEnd.dto;

import com.dwes.ApiRestBackEnd.model.License;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NoticeCreateDTO {
    private String titular;
    private String notice;
    private String dateYear;
    private String miniature;
    private License license;
} 