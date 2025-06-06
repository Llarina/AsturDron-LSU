package com.dwes.ApiRestBackEnd.service;

import com.dwes.ApiRestBackEnd.dto.LoginRequestDTO;
import com.dwes.ApiRestBackEnd.dto.RegisterRequestDTO;
import com.dwes.ApiRestBackEnd.exception.AuthenticationException;
import com.dwes.ApiRestBackEnd.model.User;
import com.dwes.ApiRestBackEnd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User login(LoginRequestDTO loginRequest) {
        // Buscar al usuario por nombre de usuario
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());
        
        // Si el usuario no existe
        if (userOptional.isEmpty()) {
            throw new AuthenticationException("El nombre de usuario no existe", "INVALID_USERNAME");
        }
        
        User user = userOptional.get();
        
        // Si la contraseña es incorrecta
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new AuthenticationException("La contraseña es incorrecta", "INVALID_PASSWORD");
        }
        
        // Si todo está correcto, devolver el usuario
        return user;
    }

    public User register(RegisterRequestDTO registerRequest) {
        boolean usernameExists = userRepository.findByUsername(registerRequest.getUsername()).isPresent();
        boolean emailExists = userRepository.findByUserEmail(registerRequest.getUserEmail()).isPresent();
        
        // Si hay múltiples errores, mostrar mensaje general
        if (usernameExists && emailExists) {
            throw new AuthenticationException("El nombre de usuario y el email ya están en uso", "MULTIPLE_FIELDS_IN_USE");
        }
        
        // Si solo el usuario ya existe
        if (usernameExists) {
            throw new AuthenticationException("El nombre de usuario ya está en uso", "USERNAME_IN_USE");
        }
        
        // Si solo el email ya existe
        if (emailExists) {
            throw new AuthenticationException("El email ya está en uso", "EMAIL_IN_USE");
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