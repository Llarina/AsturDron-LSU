import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Interfaz que define la estructura de datos de una noticia
 * Representa los datos que se reciben del backend para cada noticia
 */
export interface NoticeDTO {
  id?: number;          /* ID único de la noticia (opcional al crear, requerido al editar) */
  titular: string;      /* Título principal de la noticia */
  notice: string;       /* Contenido completo de la noticia */
  dateYear: string;     /* Año de publicación de la noticia */
  miniature?: string;   /* URL de imagen miniatura opcional para la noticia */
  username?: string;    /* Nombre del usuario que creó la noticia (generalmente admin) */
  license?: string;     /* Licencia asociada a la noticia (requerida por backend) */
}

/**
 * Servicio de Gestión de Noticias
 * 
 * Este servicio maneja todas las operaciones relacionadas con noticias del sistema:
 * - Consulta de noticias públicas
 * - CRUD completo de noticias (crear, leer, actualizar, eliminar)
 * - Filtrado por licencia de usuario
 * - Integración con panel administrativo
 * 
 * Funcionalidades especiales:
 * - Filtrado automático basado en licencia del usuario logueado
 * - Soporte para noticias públicas (license='any') y específicas por licencia
 * - Operaciones administrativas con validación de permisos
 * - Manejo de miniaturas opcionales en noticias
 */
@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  /* URL base para todas las operaciones con noticias en el backend */
  private apiUrl = 'http://localhost:8080/Notice';

  // Estado compartido de noticias en memoria
  private noticesSubject = new BehaviorSubject<NoticeDTO[]>([]);

  // Observable público para que los componentes se suscriban
  notices$ = this.noticesSubject.asObservable();

  /**
   * Constructor del servicio
   * @param http - Cliente HTTP de Angular para realizar peticiones a la API
   */
  constructor(private http: HttpClient) { 
    // Cargar noticias reales desde MySQL al inicializar
    this.loadNoticesFromDatabase();
  }

  /**
   * Carga las noticias desde la base de datos MySQL
   */
  private loadNoticesFromDatabase(): void {
    this.http.get<NoticeDTO[]>(`${this.apiUrl}`).subscribe({
      next: (notices) => {
        console.log('Noticias cargadas desde MySQL:', notices);
        this.noticesSubject.next(notices);
      },
      error: (err) => {
        console.warn('Backend no disponible, usando noticias de prueba como fallback:', err);
        // Mantener las noticias de prueba como fallback
        const fallbackNotices = [
          {
            id: 1,
            titular: 'Noticia de Prueba 1 (Fallback)',
            notice: 'Esta es una noticia de prueba porque el backend no está disponible.',
            dateYear: '2024',
            miniature: 'https://via.placeholder.com/300x200?text=Fallback+1'
          },
          {
            id: 2,
            titular: 'Noticia de Prueba 2 (Fallback)',
            notice: 'Segunda noticia de prueba como fallback del backend.',
            dateYear: '2024',
            miniature: 'https://via.placeholder.com/300x200?text=Fallback+2'
          }
        ];
        this.noticesSubject.next(fallbackNotices);
      }
    });
  }

  /**
   * Fuerza la recarga de noticias desde la base de datos
   * Útil después de operaciones de creación/actualización con archivos
   */
  public reloadNotices(): void {
    this.loadNoticesFromDatabase();
  }

  /**
   * Obtiene todas las noticias disponibles para mostrar públicamente
   * @returns Observable con array de todas las noticias en el sistema
   */
  getAllNotices(): Observable<NoticeDTO[]> {
    return this.notices$;
  }

  /**
   * Obtiene las noticias filtradas según la licencia del usuario
   * @param license - Tipo de licencia ('a1', 'a2', 'a3' o 'any' para todas)
   * @returns Observable con array de noticias filtradas por licencia
   */
  getNoticesByLicense(license: string): Observable<NoticeDTO[]> {
    // Intentar cargar desde backend con filtro de licencia
    return this.http.get<NoticeDTO[]>(`${this.apiUrl}/license/${license}`).pipe(
      catchError(err => {
        console.warn('Backend no disponible para filtro de licencia, usando datos locales');
        // Fallback a datos locales
        return this.notices$;
      })
    );
  }

  /**
   * Crea una nueva noticia en el sistema
   * Solo disponible para administradores - se asigna automáticamente al usuario admin
   * @param notice - Datos de la noticia a crear (titular, contenido, año, miniatura opcional)
   * @returns Observable con la respuesta del servidor
   */
  createNotice(notice: NoticeDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}`, notice);
  }

  /**
   * Actualiza una noticia existente en el sistema
   * Solo disponible para administradores - requiere ID válido de la noticia
   * @param id - ID de la noticia a actualizar
   * @param notice - Nuevos datos para la noticia
   * @returns Observable con la respuesta del servidor
   */
  updateNotice(id: number, notice: NoticeDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, notice);
  }

  /**
   * Elimina una noticia del sistema de forma permanente
   * Solo disponible para administradores - elimina la noticia de la base de datos
   * @param id - ID de la noticia a eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteNotice(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Métodos para manipular noticias en memoria y sincronizar con backend
  addNoticeLocal(notice: NoticeDTO): void {
    console.log('🔄 addNoticeLocal llamado:', notice);
    console.log('🌐 Intentando guardar en backend:', `${this.apiUrl}`);
    
    // Intentar crear en backend PRIMERO
    this.createNotice(notice).subscribe({
      next: (response) => {
        console.log('✅ Noticia creada exitosamente en backend MySQL:', response);
        // Recargar TODAS las noticias desde la base de datos para obtener los datos reales
        this.loadNoticesFromDatabase();
      },
      error: (err) => {
        console.error('❌ Error al guardar en backend, usando solo local como fallback:', err);
        console.error('🔍 Detalles del error:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          url: err.url
        });
        
        // Fallback: crear solo localmente si backend falla
        const currentNotices = this.noticesSubject.value;
        const newId = Math.max(...currentNotices.map(n => n.id || 0), 0) + 1;
        const newNotice = { ...notice, id: newId };
        this.noticesSubject.next([newNotice, ...currentNotices]);
        console.log('⚠️ Noticia creada SOLO localmente (no persistente):', newNotice);
      }
    });
  }

  updateNoticeLocal(noticeId: number, updatedNotice: Partial<NoticeDTO>): void {
    console.log('🔄 updateNoticeLocal llamado:', { noticeId, updatedNotice });
    console.log('🌐 Intentando actualizar en backend:', `${this.apiUrl}/${noticeId}`);
    
    // Intentar actualizar en backend PRIMERO
    this.updateNotice(noticeId, updatedNotice as NoticeDTO).subscribe({
      next: (response) => {
        console.log('✅ Noticia actualizada exitosamente en backend MySQL:', response);
        // Recargar TODAS las noticias desde la base de datos para obtener los datos reales
        this.loadNoticesFromDatabase();
      },
      error: (err) => {
        console.error('❌ Error al actualizar en backend, usando solo local como fallback:', err);
        console.error('🔍 Detalles del error:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          url: err.url
        });
        
        // Fallback: actualizar solo localmente si backend falla
        const currentNotices = this.noticesSubject.value;
        const index = currentNotices.findIndex(n => n.id === noticeId);
        if (index !== -1) {
          currentNotices[index] = { ...currentNotices[index], ...updatedNotice };
          this.noticesSubject.next([...currentNotices]);
          console.log('⚠️ Noticia actualizada SOLO localmente (no persistente):', currentNotices[index]);
        }
      }
    });
  }

  removeNoticeLocal(noticeId: number): void {
    // Intentar eliminar en backend primero
    this.deleteNotice(noticeId).subscribe({
      next: (response) => {
        console.log('Noticia eliminada en backend:', response);
        // Recargar desde backend para obtener datos actualizados
        this.loadNoticesFromDatabase();
      },
      error: (err) => {
        console.warn('Backend no disponible, eliminando solo localmente:', err);
        // Fallback: eliminar solo localmente
        const currentNotices = this.noticesSubject.value;
        const filteredNotices = currentNotices.filter(n => n.id !== noticeId);
        this.noticesSubject.next(filteredNotices);
      }
    });
  }
} 