import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interfaz que define la estructura de datos de una imagen
 * Representa los datos que se reciben del backend para cada imagen
 */
export interface ImageDTO {
  id: number;           /* Identificador único de la imagen */
  username: string;     /* Nombre del usuario que subió la imagen */
  url: string;         /* URL donde está almacenada la imagen */
  score?: number;      /* Puntuación del 1 al 5, opcional - null si no ha sido puntuada */
}

/**
 * Servicio de Gestión de Imágenes
 * 
 * Este servicio maneja todas las operaciones relacionadas con imágenes en el sistema:
 * - Consulta de imágenes públicas
 * - Subida de nuevas imágenes
 * - Sistema de puntuación (solo administradores)
 * - Eliminación de imágenes
 * 
 * Funcionalidades especiales:
 * - Manejo de respuestas en texto plano del backend
 * - Integración con sistema de puntuación de usuarios
 * - Soporte para operaciones administrativas
 */
@Injectable({
  providedIn: 'root'
})
export class ImageService {
  /* URL base para todas las operaciones con imágenes en el backend */
  private apiUrl = 'http://localhost:8080/images';

  /**
   * Constructor del servicio
   * @param http - Cliente HTTP de Angular para realizar peticiones a la API
   */
  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las imágenes disponibles en el sistema
   * Utilizado en la sección pública de ocio para mostrar la galería
   * @returns Observable con array de imágenes incluyendo datos del usuario y puntuación
   */
  getAllImages(): Observable<ImageDTO[]> {
    return this.http.get<ImageDTO[]>(this.apiUrl);
  }

  /**
   * Sube una nueva imagen al sistema
   * El backend se encarga de verificar que el usuario existe antes de crear la imagen
   * @param username - Nombre del usuario que sube la imagen
   * @param url - URL de la imagen a almacenar
   * @returns Observable con respuesta en texto plano del servidor (no JSON)
   */
  uploadImage(username: string, url: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload/${username}`, null, {
      params: { url },
      responseType: 'text'  /* El backend devuelve texto plano, no JSON */
    });
  }

  /**
   * Asigna una puntuación a una imagen específica
   * Solo disponible para administradores - actualiza automáticamente el score del usuario
   * @param id - ID de la imagen a puntuar
   * @param score - Puntuación del 1 al 5
   * @returns Observable con respuesta en texto plano del servidor
   */
  scoreImage(id: number, score: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/score`, null, {
      params: { score: score.toString() },
      responseType: 'text'  /* El backend devuelve confirmación en texto plano */
    });
  }

  /**
   * Elimina una imagen del sistema de forma permanente
   * Solo disponible para administradores - elimina la imagen de la base de datos
   * @param id - ID de la imagen a eliminar
   * @returns Observable con respuesta vacía del servidor
   */
  deleteImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 