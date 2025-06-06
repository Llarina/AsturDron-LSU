import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interfaz que define la estructura de datos del ranking de usuarios
 * Representa la información mínima necesaria para mostrar el ranking
 */
export interface RankingDTO {
  username: string;    /* Nombre del usuario en el ranking */
  score: number;       /* Puntuación total acumulada del usuario */
}

/**
 * Servicio de Gestión de Rankings
 * 
 * Este servicio maneja las consultas relacionadas con el sistema de puntuación
 * y clasificación de usuarios basado en sus contenidos puntuados:
 * - Consulta del ranking completo de usuarios
 * - Consulta del top 3 de usuarios con mayor puntuación
 * - Ordenamiento automático por puntuación (manejado por backend)
 * 
 * Funcionalidades especiales:
 * - Dos tipos de consulta: completa y top 3
 * - Datos actualizados en tiempo real desde backend
 * - Integración con sistema de puntuación de imágenes/videos
 * - Optimización para mostrar solo datos necesarios en UI
 */
@Injectable({
  providedIn: 'root'
})
export class RankingService {
  /* URL base para operaciones de ranking en el backend */
  private apiUrl = 'http://localhost:8080/User';

  /**
   * Constructor del servicio
   * @param http - Cliente HTTP de Angular para realizar peticiones a la API
   */
  constructor(private http: HttpClient) { }

  /**
   * Obtiene el ranking completo de todos los usuarios ordenado por puntuación
   * Utiliza el endpoint /ranking que EXCLUYE automáticamente al admin
   * @returns Observable con array de usuarios ordenados por score descendente (sin admin)
   */
  getAllRanking(): Observable<RankingDTO[]> {
    return this.http.get<RankingDTO[]>(`${this.apiUrl}/ranking`);
  }

  /**
   * Obtiene solo los 3 usuarios con mayor puntuación
   * Utilizado en la vista inicial del ranking para mostrar los destacados
   * @returns Observable con array de los top 3 usuarios por score
   */
  getRankingTop3(): Observable<RankingDTO[]> {
    return this.http.get<RankingDTO[]>(`${this.apiUrl}/ranking/top3`);
  }
} 