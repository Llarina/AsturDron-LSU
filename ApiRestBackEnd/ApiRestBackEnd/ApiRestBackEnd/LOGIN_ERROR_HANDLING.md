# Manejo Específico de Errores de Autenticación

## Descripción
Se ha implementado un sistema de manejo de errores específicos para el inicio de sesión y registro que detecta y reporta por separado diferentes tipos de errores, proporcionando mensajes claros y específicos al usuario.

## Archivos Modificados/Creados

### 1. Nueva Excepción Personalizada
**Archivo:** `src/main/java/com/dwes/ApiRestBackEnd/exception/AuthenticationException.java`

```java
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
```

### 2. DTO para Respuestas de Error
**Archivo:** `src/main/java/com/dwes/ApiRestBackEnd/dto/ErrorResponseDTO.java`

```java
@Data
@AllArgsConstructor
public class ErrorResponseDTO {
    private String message;      // Mensaje descriptivo del error
    private String errorType;    // Tipo de error específico
    private int status;          // Código de estado HTTP
}
```

### 3. Manejador Global de Excepciones
**Archivo:** `src/main/java/com/dwes/ApiRestBackEnd/exception/GlobalExceptionHandler.java`

```java
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
```

### 4. Servicio de Autenticación Modificado
**Archivo:** `src/main/java/com/dwes/ApiRestBackEnd/service/AuthService.java`

#### Método Login:
```java
public User login(LoginRequestDTO loginRequest) {
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
    
    return user;
}
```

#### Método Register:
```java
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

    // Crear nuevo usuario...
    return userRepository.save(newUser);
}
```

### 5. Controladores de Autenticación Modificados
**Archivo:** `src/main/java/com/dwes/ApiRestBackEnd/controller/AuthController.java`

Ambos endpoints ahora manejan específicamente las excepciones:

```java
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
```

## Tipos de Respuesta

### ✅ Login/Registro Exitoso (200 OK)
```json
{
    "id": 1,
    "username": "usuario123",
    "userEmail": "usuario@example.com",
    "license": "A1",
    "score": 0
}
```

### ❌ Errores de Login (401 Unauthorized)

#### Usuario No Encontrado
```json
{
    "message": "El nombre de usuario no existe",
    "errorType": "INVALID_USERNAME",
    "status": 401
}
```

#### Contraseña Incorrecta
```json
{
    "message": "La contraseña es incorrecta",
    "errorType": "INVALID_PASSWORD",
    "status": 401
}
```

### ❌ Errores de Registro (400 Bad Request)

#### Solo Username Duplicado
```json
{
    "message": "El nombre de usuario ya está en uso",
    "errorType": "USERNAME_IN_USE",
    "status": 400
}
```

#### Solo Email Duplicado
```json
{
    "message": "El email ya está en uso",
    "errorType": "EMAIL_IN_USE",
    "status": 400
}
```

#### Múltiples Campos Duplicados
```json
{
    "message": "El nombre de usuario y el email ya están en uso",
    "errorType": "MULTIPLE_FIELDS_IN_USE",
    "status": 400
}
```

## Tipos de Error Implementados

### 🔐 **Errores de Login**
- **`INVALID_USERNAME`**: Usuario no existe en el sistema
- **`INVALID_PASSWORD`**: Contraseña incorrecta para el usuario existente

### 📝 **Errores de Registro**
- **`USERNAME_IN_USE`**: El nombre de usuario ya está registrado
- **`EMAIL_IN_USE`**: El email ya está registrado
- **`MULTIPLE_FIELDS_IN_USE`**: Tanto el username como el email ya están en uso

## Casos de Prueba

### Login
1. **Usuario inexistente** → `INVALID_USERNAME`
2. **Contraseña incorrecta** → `INVALID_PASSWORD`
3. **Credenciales correctas** → Login exitoso

### Registro
1. **Username duplicado** → `USERNAME_IN_USE`
2. **Email duplicado** → `EMAIL_IN_USE`
3. **Ambos duplicados** → `MULTIPLE_FIELDS_IN_USE`
4. **Datos únicos** → Registro exitoso

## Ventajas de esta Implementación

1. **Especificidad**: El usuario sabe exactamente qué campo corregir
2. **Eficiencia**: Se verifican múltiples errores en una sola operación
3. **Experiencia de Usuario**: Mensajes claros y accionables
4. **Mantenibilidad**: Sistema centralizado y extensible
5. **Consistencia**: Mismo patrón para login y registro 