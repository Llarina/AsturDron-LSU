import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnnouncementDTO {
  id?: number;
  title: string;
  content: string;
  username: string;
  createdAt?: string;
  updatedAt?: string;
  commentCount?: number; // Número de comentarios
}

export interface AnnouncementCreateRequest {
  title: string;
  content: string;
  username: string;
}

/**
 * Servicio de Gestión de Anuncios
 * 
 * Este servicio maneja todas las operaciones relacionadas con el tablón de anuncios:
 * - Consulta de anuncios públicos
 * - CRUD completo de anuncios (crear, leer, actualizar, eliminar)
 * - Filtrado por usuario
 * 
 * Funcionalidades especiales:
 * - Solo usuarios autenticados pueden crear anuncios
 * - Solo el autor o admin pueden editar/eliminar anuncios
 * - Ordenación cronológica (más recientes primero)
 */
@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl = 'http://localhost:8080/announcements';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los anuncios ordenados por fecha de creación (más recientes primero)
   * @returns Observable con array de todos los anuncios
   */
  getAllAnnouncements(): Observable<AnnouncementDTO[]> {
    return this.http.get<AnnouncementDTO[]>(this.apiUrl);
  }

  /**
   * Obtiene los anuncios de un usuario específico
   * @param username - Nombre del usuario
   * @returns Observable con array de anuncios del usuario
   */
  getAnnouncementsByUser(username: string): Observable<AnnouncementDTO[]> {
    return this.http.get<AnnouncementDTO[]>(`${this.apiUrl}/user/${username}`);
  }

  /**
   * Crea un nuevo anuncio
   * @param announcement - Datos del anuncio a crear
   * @returns Observable con el anuncio creado
   */
  createAnnouncement(announcement: AnnouncementCreateRequest): Observable<AnnouncementDTO> {
    return this.http.post<AnnouncementDTO>(this.apiUrl, announcement);
  }

  /**
   * Actualiza un anuncio existente
   * @param id - ID del anuncio a actualizar
   * @param announcement - Nuevos datos del anuncio
   * @returns Observable con el anuncio actualizado
   */
  updateAnnouncement(id: number, announcement: AnnouncementCreateRequest): Observable<AnnouncementDTO> {
    return this.http.put<AnnouncementDTO>(`${this.apiUrl}/${id}`, announcement);
  }

  /**
   * Elimina un anuncio
   * @param id - ID del anuncio a eliminar
   * @param username - Nombre del usuario que elimina (para verificación de permisos)
   * @returns Observable con la respuesta del servidor
   */
  deleteAnnouncement(id: number, username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}?username=${username}`);
  }
} 