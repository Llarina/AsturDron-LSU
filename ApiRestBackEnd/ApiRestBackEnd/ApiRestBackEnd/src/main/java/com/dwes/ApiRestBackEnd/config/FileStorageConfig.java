package com.dwes.ApiRestBackEnd.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class FileStorageConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Configurar el directorio para servir archivos estáticos
        // Usar ruta absoluta hacia el directorio donde realmente se guardan las imágenes
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:C:/AsturDron-LSU/ApiRestBackEnd/uploads/");
    }
} 