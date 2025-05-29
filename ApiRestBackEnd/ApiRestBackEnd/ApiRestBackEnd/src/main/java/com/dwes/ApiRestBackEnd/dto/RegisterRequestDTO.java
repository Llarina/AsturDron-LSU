package com.dwes.ApiRestBackEnd.dto;

import com.dwes.ApiRestBackEnd.model.License;
import lombok.Data;

@Data
public class RegisterRequestDTO {
    private String username;
    private String userEmail;
    private String password;
    private License license;
} 