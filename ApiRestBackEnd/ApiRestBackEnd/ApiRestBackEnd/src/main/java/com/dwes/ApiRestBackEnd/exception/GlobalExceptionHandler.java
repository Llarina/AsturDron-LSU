package com.dwes.ApiRestBackEnd.exception;

import com.dwes.ApiRestBackEnd.dto.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponseDTO> handleAuthenticationException(AuthenticationException ex) {
        // Determinar el código de estado según el tipo de error
        HttpStatus status = getHttpStatusForErrorType(ex.getErrorType());
        
        ErrorResponseDTO error = new ErrorResponseDTO(
            ex.getMessage(),
            ex.getErrorType(),
            status.value()
        );
        return ResponseEntity.status(status).body(error);
    }
    
    /**
     * Determina el código de estado HTTP apropiado según el tipo de error
     */
    private HttpStatus getHttpStatusForErrorType(String errorType) {
        switch (errorType) {
            case "INVALID_USERNAME":
            case "INVALID_PASSWORD":
                return HttpStatus.UNAUTHORIZED;
            case "USERNAME_IN_USE":
            case "EMAIL_IN_USE":
            case "MULTIPLE_FIELDS_IN_USE":
                return HttpStatus.BAD_REQUEST;
            default:
                return HttpStatus.UNAUTHORIZED;
        }
    }
} 