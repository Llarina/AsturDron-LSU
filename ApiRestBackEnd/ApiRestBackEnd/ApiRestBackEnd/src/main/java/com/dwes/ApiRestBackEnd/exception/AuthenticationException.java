package com.dwes.ApiRestBackEnd.exception;

public class AuthenticationException extends RuntimeException {
    private String errorType;
    
    public AuthenticationException(String message, String errorType) {
        super(message);
        this.errorType = errorType;
    }
    
    public String getErrorType() {
        return errorType;
    }
} 