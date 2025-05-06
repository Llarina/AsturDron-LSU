package com.dwes.ApiRestBackEnd.dto;

import com.dwes.ApiRestBackEnd.model.User;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RankingRequestDTO {
    private String username;
    private int score;
}
