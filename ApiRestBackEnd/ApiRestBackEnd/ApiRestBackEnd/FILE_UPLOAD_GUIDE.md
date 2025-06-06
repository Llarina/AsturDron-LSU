# Guía de Subida de Archivos - AsturDron

## Descripción General

Esta funcionalidad permite a los usuarios subir imágenes y videos tanto desde URLs como desde archivos locales. El sistema incluye validación de tipos de archivo, límites de tamaño y almacenamiento seguro.

## Funcionalidades Implementadas

### Backend (Spring Boot)

#### 1. Servicio de Almacenamiento de Archivos (`FileStorageService`)
- **Ubicación**: `src/main/java/com/dwes/ApiRestBackEnd/service/FileStorageService.java`
- **Funciones**:
  - Almacenamiento seguro de archivos con nombres únicos (UUID)
  - Validación de tipos de archivo permitidos
  - Límite de tamaño de 50MB por archivo
  - Organización en subdirectorios (`uploads/images/`, `uploads/videos/`)
  - Eliminación de archivos al borrar contenido

#### 2. Endpoints de Imágenes
- **URL Base**: `/images`
- **Endpoints**:
  - `POST /upload/{username}` - Subida desde URL (método original)
  - `POST /upload-file/{username}` - Subida desde archivo local (nuevo)
  - `GET /` - Obtener todas las imágenes
  - `DELETE /{id}` - Eliminar imagen (incluye archivo físico)
  - `PUT /{id}/score` - Puntuar imagen

#### 3. Endpoints de Videos
- **URL Base**: `/Videos`
- **Endpoints**:
  - `POST /upload/{username}` - Subida desde URLs (método original)
  - `POST /upload-file/{username}` - Subida con video y miniatura (nuevo)
  - `POST /upload-video-only/{username}` - Subida solo video sin miniatura (nuevo)
  - `GET /` - Obtener todos los videos
  - `DELETE /{id}` - Eliminar video (incluye archivos físicos)
  - `PUT /{id}/score` - Puntuar video

#### 4. Configuración
- **Archivo**: `application.properties`
- **Configuraciones**:
  ```properties
  # Configuración para subida de archivos
  spring.servlet.multipart.enabled=true
  spring.servlet.multipart.max-file-size=50MB
  spring.servlet.multipart.max-request-size=50MB
  
  # Configuración personalizada para almacenamiento
  app.upload.dir=uploads
  app.base.url=http://localhost:8080
  ```

### Frontend (Angular)

#### 1. Componente Upload Modal (`UploadModalComponent`)
- **Ubicación**: `src/app/components/upload-modal/upload-modal.component.ts`
- **Funcionalidades**:
  - Toggle entre subida por URL y archivo local
  - Previsualización de imágenes antes de subir
  - Validación de tipos de archivo en el cliente
  - Indicador de progreso durante la subida
  - Auto-rellenado del username para usuarios logueados
  - Manejo de errores específicos

#### 2. Integración en Componente Ocio
- **Ubicación**: `src/app/ocio/ocio.component.ts`
- **Funcionalidades**:
  - Manejo del evento `uploadSuccess` del modal
  - Recarga automática del contenido tras subida exitosa
  - Mensajes de éxito y error

## Tipos de Archivo Permitidos

### Imágenes
- `image/jpeg`
- `image/jpg`
- `image/png`
- `image/gif`
- `image/webp`

### Videos
- `video/mp4`
- `video/avi`
- `video/mov`
- `video/wmv`
- `video/webm`

## Estructura de Directorios

```
uploads/
├── images/
│   └── [archivos de imagen con nombres UUID]
└── videos/
    └── [archivos de video con nombres UUID]
```

## Flujo de Subida de Archivos

### 1. Subida de Imagen
1. Usuario selecciona archivo en el frontend
2. Validación de tipo y tamaño en el cliente
3. Previsualización (opcional)
4. Envío via FormData al endpoint `/images/upload-file/{username}`
5. Backend valida y almacena el archivo
6. Retorna URL pública del archivo
7. Se guarda en base de datos con la URL generada

### 2. Subida de Video
1. Usuario selecciona archivo de video y miniatura
2. Validación de tipos y tamaños
3. Envío via FormData al endpoint `/Videos/upload-file/{username}`
4. Backend almacena ambos archivos
5. Retorna confirmación de éxito
6. Se guarda en base de datos con las URLs generadas

## Seguridad y Validaciones

### Backend
- Validación de tipos MIME
- Límite de tamaño de archivo (50MB)
- Nombres de archivo únicos (UUID) para evitar conflictos
- Sanitización de nombres de archivo originales
- Verificación de existencia de usuario

### Frontend
- Validación de tipos de archivo antes del envío
- Previsualización para confirmar selección
- Indicadores de progreso para mejorar UX
- Manejo de errores con mensajes específicos

## Ejemplos de Uso

### Subida de Imagen (cURL)
```bash
curl -X POST \
  http://localhost:8080/images/upload-file/usuario123 \
  -F "file=@/ruta/a/imagen.jpg"
```

### Subida de Video con Miniatura (cURL)
```bash
curl -X POST \
  http://localhost:8080/Videos/upload-file/usuario123 \
  -F "videoFile=@/ruta/a/video.mp4" \
  -F "miniatureFile=@/ruta/a/miniatura.jpg"
```

## Mantenimiento

### Limpieza de Archivos
- Los archivos se eliminan automáticamente al borrar contenido de la base de datos
- El método `deleteFile()` en `FileStorageService` maneja la eliminación física

### Monitoreo de Espacio
- Revisar periódicamente el directorio `uploads/` para gestión de espacio
- Considerar implementar rotación de archivos antiguos si es necesario

## Mejoras Futuras Sugeridas

1. **Compresión de Imágenes**: Implementar compresión automática para optimizar almacenamiento
2. **Generación de Miniaturas**: Crear miniaturas automáticas para videos
3. **CDN Integration**: Integrar con servicios de CDN para mejor rendimiento
4. **Virus Scanning**: Añadir escaneo de virus para archivos subidos
5. **Watermarking**: Implementar marcas de agua automáticas
6. **Backup Strategy**: Estrategia de respaldo para archivos subidos 