import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interfaz que define la estructura de datos de un video
 * Representa los datos que se reciben del backend para cada video
 */
export interface VideoDTO {
  id: number;          /* Identificador único del video */
  username: string;    /* Nombre del usuario que subió el video */
  miniature: string;   /* URL de la imagen miniatura del video */
  video: string;       /* URL donde está almacenado el video */
  score?: number;      /* Puntuación del 1 al 5, opcional - null si no ha sido puntuada */
}

/**
 * Servicio de Gestión de Videos
 * 
 * Este servicio maneja todas las operaciones relacionadas con videos en el sistema:
 * - Consulta de videos públicos
 * - Subida de nuevos videos con miniatura
 * - Sistema de puntuación (solo administradores)
 * - Eliminación de videos
 * 
 * Funcionalidades especiales:
 * - Manejo dual de URLs (video y miniatura)
 * - Respuestas en texto plano del backend
 * - Integración con sistema de puntuación de usuarios
 * - Soporte para modal de reproducción
 */
@Injectable({
  providedIn: 'root'
})
export class VideoService {
  /* URL base para todas las operaciones con videos en el backend */
  private apiUrl = 'http://localhost:8080/Videos';

  /**
   * Constructor del servicio
   * @param http - Cliente HTTP de Angular para realizar peticiones a la API
   */
  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los videos disponibles en el sistema
   * Utilizado en la sección pública de ocio para mostrar la galería de videos
   * @returns Observable con array de videos incluyendo miniatura, video y puntuación
   */
  getAllVideos(): Observable<VideoDTO[]> {
    return this.http.get<VideoDTO[]>(this.apiUrl);
  }

  /**
   * Sube un nuevo video al sistema con su miniatura
   * El backend verifica que el usuario existe antes de crear el video
   * @param username - Nombre del usuario que sube el video
   * @param miniatureUrl - URL de la imagen miniatura para el video
   * @param videoUrl - URL del archivo de video
   * @returns Observable con respuesta en texto plano del servidor
   */
  uploadVideo(username: string, miniatureUrl: string, videoUrl: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/upload/${username}`, null, {
      params: {
        miniature: miniatureUrl,
        video: videoUrl
      },
      responseType: 'text' as 'json'  /* Conversión de tipo para manejar respuesta texto */
    });
  }

  /**
   * Asigna una puntuación a un video específico
   * Solo disponible para administradores - actualiza automáticamente el score del usuario
   * @param id - ID del video a puntuar
   * @param score - Puntuación del 1 al 5
   * @returns Observable con respuesta en texto plano del servidor
   */
  scoreVideo(id: number, score: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/score`, null, {
      params: { score: score.toString() },
      responseType: 'text'  /* El backend devuelve confirmación en texto plano */
    });
  }

  /**
   * Elimina un video del sistema de forma permanente
   * Solo disponible para administradores - elimina el video de la base de datos
   * @param id - ID del video a eliminar
   * @returns Observable con respuesta vacía del servidor
   */
  deleteVideo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 