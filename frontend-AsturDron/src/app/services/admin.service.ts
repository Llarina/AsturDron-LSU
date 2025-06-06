import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth.service';
import { NoticeDTO } from './notice.service';
import { ImageDTO } from './image.service';
import { VideoDTO } from './video.service';

/**
 * Interfaz para las peticiones de creación de noticias
 * Define la estructura de datos necesaria para crear o editar una noticia
 */
export interface NoticeCreateRequest {
  titular: string;                           // Título de la noticia
  notice: string;                           // Contenido de la noticia
  dateYear: string;                         // Año de publicación
  miniature?: string;                       // URL de la miniatura (opcional)
  license: 'a1' | 'a2' | 'a3' | 'any';     // Licencia requerida para ver la noticia
}

/**
 * Servicio de Administración
 * 
 * Este servicio centraliza todas las operaciones administrativas del sistema.
 * Proporciona métodos para gestionar usuarios, noticias, imágenes y videos
 * desde el panel de administración.
 * 
 * Funcionalidades:
 * - CRUD completo de noticias
 * - Gestión de usuarios (consulta y eliminación)
 * - Gestión de imágenes (consulta y eliminación)
 * - Gestión de videos (consulta y eliminación)
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // === CONFIGURACIÓN DE URLs DE LA API ===
  
  /** URL base para operaciones con usuarios */
  private userApiUrl = 'http://localhost:8080/User';
  
  /** URL base para operaciones con noticias */
  private noticeApiUrl = 'http://localhost:8080/Notice';
  
  /** URL base para operaciones con imágenes */
  private imageApiUrl = 'http://localhost:8080/images';
  
  /** URL base para operaciones con videos */
  private videoApiUrl = 'http://localhost:8080/Videos';

  /**
   * Constructor del servicio
   * @param http - Cliente HTTP de Angular para realizar peticiones a la API
   */
  constructor(private http: HttpClient) { }

  // === MÉTODOS DE GESTIÓN DE USUARIOS ===

  /**
   * Obtiene la lista completa de usuarios del sistema
   * @returns Observable con array de usuarios
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.userApiUrl}`);
  }

  /**
   * Obtiene la lista completa de usuarios del sistema en formato DTO
   * @returns Observable con array de usuarios en formato DTO
   */
  getAllUsersDTO(): Observable<any[]> {
    return this.http.get<any[]>(`${this.userApiUrl}/dto`);
  }

  /**
   * Elimina un usuario del sistema de forma permanente
   * @param username - Nombre del usuario a eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteUser(username: string): Observable<any> {
    return this.http.delete(`${this.userApiUrl}/username/${username}`);
  }

  // === MÉTODOS DE GESTIÓN DE NOTICIAS ===

  /**
   * Obtiene la lista completa de noticias del sistema
   * @returns Observable con array de noticias
   */
  getAllNotices(): Observable<NoticeDTO[]> {
    return this.http.get<NoticeDTO[]>(`${this.noticeApiUrl}`);
  }

  /**
   * Crea una nueva noticia en el sistema
   * @param notice - Datos de la noticia a crear
   * @returns Observable con la respuesta del servidor
   */
  createNotice(notice: NoticeCreateRequest): Observable<any> {
    // Configurar headers para envío de JSON
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Crear el objeto notice con la estructura esperada por el backend
    const noticeData = {
      titular: notice.titular,
      notice: notice.notice,
      dateYear: notice.dateYear,
      miniature: notice.miniature || '',
      license: notice.license  // El backend se encarga de asignar el usuario admin
    };

    return this.http.post(`${this.noticeApiUrl}`, noticeData, { headers });
  }

  /**
   * Actualiza una noticia existente
   * @param id - ID de la noticia a actualizar
   * @param notice - Nuevos datos de la noticia
   * @returns Observable con la respuesta del servidor
   */
  updateNotice(id: number, notice: NoticeCreateRequest): Observable<any> {
    // Configurar headers para envío de JSON
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Preparar datos en el formato esperado por el backend
    const noticeData = {
      titular: notice.titular,
      notice: notice.notice,
      dateYear: notice.dateYear,
      miniature: notice.miniature || '',
      license: notice.license
    };

    return this.http.put(`${this.noticeApiUrl}/${id}`, noticeData, { headers });
  }

  /**
   * Elimina una noticia del sistema de forma permanente
   * @param id - ID de la noticia a eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteNotice(id: number): Observable<any> {
    return this.http.delete(`${this.noticeApiUrl}/${id}`);
  }

  // === MÉTODOS DE GESTIÓN DE IMÁGENES ===

  /**
   * Obtiene la lista completa de imágenes del sistema
   * Incluye todas las imágenes, incluso las del administrador
   * @returns Observable con array de imágenes
   */
  getAllImagesAdmin(): Observable<ImageDTO[]> {
    return this.http.get<ImageDTO[]>(`${this.imageApiUrl}`);
  }

  /**
   * Elimina una imagen del sistema de forma permanente
   * @param id - ID de la imagen a eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteImage(id: number): Observable<any> {
    return this.http.delete(`${this.imageApiUrl}/${id}`);
  }

  // === MÉTODOS DE GESTIÓN DE VIDEOS ===

  /**
   * Obtiene la lista completa de videos del sistema
   * Incluye todos los videos, incluso los del administrador
   * @returns Observable con array de videos
   */
  getAllVideosAdmin(): Observable<VideoDTO[]> {
    return this.http.get<VideoDTO[]>(`${this.videoApiUrl}`);
  }

  /**
   * Elimina un video del sistema de forma permanente
   * @param id - ID del video a eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteVideo(id: number): Observable<any> {
    return this.http.delete(`${this.videoApiUrl}/${id}`);
  }
} 