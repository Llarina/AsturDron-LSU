package com.dwes.ApiRestBackEnd.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NoticeRequestDTO {
    private String titular;
    private String notice;
    private String dateYear;
}
