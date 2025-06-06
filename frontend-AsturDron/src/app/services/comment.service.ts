import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CommentDTO {
  id?: number;
  content: string;
  username: string;
  announcementId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommentCreateRequest {
  content: string;
  username: string;
  announcementId: number;
}

/**
 * Servicio de Gestión de Comentarios
 * 
 * Este servicio maneja todas las operaciones relacionadas con comentarios en anuncios:
 * - Consulta de comentarios por anuncio
 * - CRUD completo de comentarios (crear, leer, actualizar, eliminar)
 * 
 * Funcionalidades especiales:
 * - Solo usuarios autenticados pueden comentar
 * - Solo el autor o admin pueden editar/eliminar comentarios
 * - Comentarios ordenados cronológicamente
 */
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/comments';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los comentarios de un anuncio específico
   * @param announcementId - ID del anuncio
   * @returns Observable con array de comentarios del anuncio
   */
  getCommentsByAnnouncementId(announcementId: number): Observable<CommentDTO[]> {
    return this.http.get<CommentDTO[]>(`${this.apiUrl}/announcement/${announcementId}`);
  }

  /**
   * Crea un nuevo comentario
   * @param comment - Datos del comentario a crear
   * @returns Observable con el comentario creado
   */
  createComment(comment: CommentCreateRequest): Observable<CommentDTO> {
    return this.http.post<CommentDTO>(this.apiUrl, comment);
  }

  /**
   * Actualiza un comentario existente
   * @param id - ID del comentario a actualizar
   * @param comment - Nuevos datos del comentario
   * @returns Observable con el comentario actualizado
   */
  updateComment(id: number, comment: CommentCreateRequest): Observable<CommentDTO> {
    return this.http.put<CommentDTO>(`${this.apiUrl}/${id}`, comment);
  }

  /**
   * Elimina un comentario
   * @param id - ID del comentario a eliminar
   * @param username - Nombre del usuario que elimina (para verificación de permisos)
   * @returns Observable con la respuesta del servidor
   */
  deleteComment(id: number, username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}?username=${username}`);
  }
} 