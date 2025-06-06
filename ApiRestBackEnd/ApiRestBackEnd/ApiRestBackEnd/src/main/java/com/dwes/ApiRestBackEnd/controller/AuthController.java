package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.ErrorResponseDTO;
import com.dwes.ApiRestBackEnd.dto.LoginRequestDTO;
import com.dwes.ApiRestBackEnd.dto.RegisterRequestDTO;
import com.dwes.ApiRestBackEnd.exception.AuthenticationException;
import com.dwes.ApiRestBackEnd.model.User;
import com.dwes.ApiRestBackEnd.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            User user = authService.login(loginRequest);
            return ResponseEntity.ok(user);
        } catch (AuthenticationException ex) {
            ErrorResponseDTO error = new ErrorResponseDTO(
                ex.getMessage(), 
                ex.getErrorType(), 
                HttpStatus.UNAUTHORIZED.value()
            );
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO registerRequest) {
        try {
            User user = authService.register(registerRequest);
            return ResponseEntity.ok(user);
        } catch (AuthenticationException ex) {
            ErrorResponseDTO error = new ErrorResponseDTO(
                ex.getMessage(), 
                ex.getErrorType(), 
                HttpStatus.BAD_REQUEST.value()
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
} 