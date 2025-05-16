package com.dwes.ApiRestBackEnd.dto;

import lombok.Builder;
import lombok.Data;
import org.springframework.boot.autoconfigure.elasticsearch.ElasticsearchConnectionDetails;

@Data
@Builder
public class UserRequestDTO {
    private String username;
    private String user_email;
    private int score;

}
