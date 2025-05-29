package com.dwes.ApiRestBackEnd.service;

import com.dwes.ApiRestBackEnd.dto.LoginRequestDTO;
import com.dwes.ApiRestBackEnd.dto.RegisterRequestDTO;
import com.dwes.ApiRestBackEnd.model.User;
import com.dwes.ApiRestBackEnd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;

    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User login(LoginRequestDTO loginRequest) {
        return userRepository.findByUsername(loginRequest.getUsername())
                .filter(user -> user.getPassword().equals(loginRequest.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos"));
    }

    public User register(RegisterRequestDTO registerRequest) {
        // Verificar si el usuario ya existe
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "El nombre de usuario ya está en uso");
        }

        // Verificar si el email ya está en uso
        if (userRepository.findByUserEmail(registerRequest.getUserEmail()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "El email ya está en uso");
        }

        // Crear nuevo usuario
        User newUser = new User();
        newUser.setUsername(registerRequest.getUsername());
        newUser.setUserEmail(registerRequest.getUserEmail());
        newUser.setPassword(registerRequest.getPassword());
        newUser.setLicense(registerRequest.getLicense());
        newUser.setScore(0);

        return userRepository.save(newUser);
    }
} 