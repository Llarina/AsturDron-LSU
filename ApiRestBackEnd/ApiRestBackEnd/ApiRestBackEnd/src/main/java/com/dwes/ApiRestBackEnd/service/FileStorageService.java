package com.dwes.ApiRestBackEnd.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadPath;
    private final String baseUrl;

    // Tipos de archivo permitidos
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );
    
    private static final List<String> ALLOWED_VIDEO_TYPES = Arrays.asList(
        "video/mp4", "video/avi", "video/mov", "video/wmv", "video/webm"
    );

    public FileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir,
                            @Value("${app.base.url:http://localhost:8080}") String baseUrl) {
        // Usar ruta absoluta para asegurar que las imágenes se guardan en el lugar correcto
        this.uploadPath = Paths.get("C:/AsturDron-LSU/ApiRestBackEnd/uploads").toAbsolutePath().normalize();
        this.baseUrl = baseUrl;
        
        try {
            Files.createDirectories(this.uploadPath);
            Files.createDirectories(this.uploadPath.resolve("images"));
            Files.createDirectories(this.uploadPath.resolve("videos"));
        } catch (Exception ex) {
            throw new RuntimeException("No se pudo crear el directorio de subida de archivos.", ex);
        }
    }

    /**
     * Guarda una imagen subida por el usuario
     */
    public String storeImage(MultipartFile file) throws IOException {
        return storeFile(file, "images", ALLOWED_IMAGE_TYPES);
    }

    /**
     * Guarda un video subido por el usuario
     */
    public String storeVideo(MultipartFile file) throws IOException {
        return storeFile(file, "videos", ALLOWED_VIDEO_TYPES);
    }

    /**
     * Método privado para almacenar cualquier tipo de archivo
     */
    private String storeFile(MultipartFile file, String subfolder, List<String> allowedTypes) throws IOException {
        // Validaciones
        if (file.isEmpty()) {
            throw new RuntimeException("Error: El archivo está vacío");
        }

        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new RuntimeException("Error: Tipo de archivo no permitido. Tipos permitidos: " + allowedTypes);
        }

        // Validar tamaño (máximo 50MB)
        if (file.getSize() > 50 * 1024 * 1024) {
            throw new RuntimeException("Error: El archivo es demasiado grande. Máximo 50MB permitido.");
        }

        // Generar nombre único para el archivo
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        // Crear el path completo
        Path targetLocation = this.uploadPath.resolve(subfolder).resolve(uniqueFilename);

        // Guardar el archivo
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // Retornar solo la ruta relativa (SIN la URL base)
        return "uploads/" + subfolder + "/" + uniqueFilename;
    }

    /**
     * Obtiene la extensión del archivo
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex == -1) {
            return "";
        }
        return filename.substring(dotIndex);
    }

    /**
     * Elimina un archivo del sistema
     */
    public void deleteFile(String filePath) {
        try {
            Path targetPath;
            
            // Si es una ruta relativa (empieza con "uploads/"), usarla directamente
            if (filePath.startsWith("uploads/")) {
                targetPath = uploadPath.resolve(filePath.substring("uploads/".length()));
            } 
            // Si es una URL completa, extraer la parte relativa
            else if (filePath.contains("/uploads/")) {
                String relativePath = filePath.substring(filePath.indexOf("/uploads/") + "/uploads/".length());
                targetPath = uploadPath.resolve(relativePath);
            }
            // Si no contiene uploads, asumir que es externa (no eliminar)
            else {
                return; // No eliminar URLs externas
            }
            
            if (Files.exists(targetPath)) {
                Files.delete(targetPath);
            }
        } catch (IOException ex) {
            // Log error but don't throw exception
            System.err.println("Error eliminando archivo: " + ex.getMessage());
        }
    }

    /**
     * Convierte una ruta relativa a URL completa
     */
    public String getFullUrl(String relativePath) {
        if (relativePath == null || relativePath.isEmpty()) {
            return relativePath;
        }
        
        // Si ya es una URL completa, devolverla tal como está
        if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
            return relativePath;
        }
        
        // Si es una ruta relativa, construir la URL completa
        if (relativePath.startsWith("uploads/")) {
            return baseUrl + "/" + relativePath;
        }
        
        // Para otros casos, asumir que es una URL externa
        return relativePath;
    }

    /**
     * Verifica si un archivo es local (está en nuestro sistema)
     */
    public boolean isLocalFile(String filePath) {
        return filePath != null && filePath.startsWith("uploads/");
    }
} 