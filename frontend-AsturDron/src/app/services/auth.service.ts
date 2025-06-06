import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Interfaz que define la estructura de datos de un usuario
 * Representa tanto usuarios registrados como información de sesión
 */
export interface User {
  id?: number;              /* ID único del usuario en la base de datos */
  username: string;         /* Nombre de usuario único en el sistema */
  password?: string;        /* Contraseña (solo se usa en registro/login, no se almacena) */
  userEmail: string;        /* Email del usuario para comunicaciones */
  license?: string;         /* Licencia de dron del usuario ('a1', 'a2', 'a3' o null) */
  score?: number;           /* Puntuación acumulada del usuario por sus contenidos */
}

/**
 * Servicio de Autenticación y Gestión de Usuarios
 * 
 * Este servicio maneja todo lo relacionado con autenticación y usuarios:
 * - Registro de nuevos usuarios
 * - Login y logout del sistema
 * - Gestión de estado de sesión (BehaviorSubject reactivo)
 * - Almacenamiento persistente en localStorage (solo en browser)
 * - Verificación de credenciales con backend
 * - Compatibilidad con Server-Side Rendering (SSR)
 * 
 * Funcionalidades especiales:
 * - Estado reactivo con BehaviorSubject para componentes que necesiten usuario actual
 * - Persistencia de sesión entre recargas de página (solo en browser)
 * - Manejo centralizado de errores de autenticación
 * - Integración con sistema de permisos (admin vs usuario normal)
 * - Soporte completo para SSR sin errores de localStorage
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /* URL base para operaciones de autenticación en el backend */
  private apiUrl = 'http://localhost:8080/auth';
  
  /* BehaviorSubject que mantiene el estado del usuario actual de forma reactiva */
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  
  /* Observable público para que los componentes se suscriban a cambios del usuario actual */
  public currentUser$ = this.currentUserSubject.asObservable();

  /**
   * Constructor del servicio
   * @param http - Cliente HTTP de Angular para comunicación con el backend
   * @param platformId - ID de la plataforma para verificar si estamos en browser o servidor
   */
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  /**
   * Registra un nuevo usuario en el sistema
   * Crea la cuenta y automáticamente inicia sesión si es exitoso
   * @param user - Datos del usuario a registrar (username, password, email, license opcional)
   * @returns Observable con respuesta del servidor
   */
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap((response: any) => {
        /* Si el registro es exitoso, guardar usuario y establecer sesión automáticamente */
        if (response) {
          const loggedUser: User = {
            username: user.username,
            userEmail: user.userEmail,
            license: user.license,
            score: 0  /* Los nuevos usuarios empiezan con score 0 */
          };
          this.setCurrentUser(loggedUser);
        }
      })
    );
  }

  /**
   * Inicia sesión de un usuario en el sistema
   * Verifica credenciales con el backend y establece la sesión
   * @param username - Nombre de usuario
   * @param password - Contraseña
   * @returns Observable con datos del usuario si el login es exitoso
   */
  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((user: User) => {
        /* Si el login es exitoso, establecer el usuario actual y persistir en storage */
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  /**
   * Cierra la sesión del usuario actual
   * Limpia el estado local y el almacenamiento persistente
   */
  logout(): void {
    /* Solo intentar acceder a localStorage en el browser */
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');    /* Eliminar de localStorage */
    }
    this.currentUserSubject.next(null);       /* Actualizar BehaviorSubject */
  }

  /**
   * Obtiene el usuario actualmente logueado
   * @returns El usuario actual o null si no hay sesión activa
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si hay un usuario logueado actualmente
   * @returns true si hay un usuario logueado, false en caso contrario
   */
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Verifica si el usuario actual es administrador
   * @returns true si el usuario logueado es 'admin', false en caso contrario
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.username === 'admin';
  }

  /**
   * Establece el usuario actual y lo persiste en localStorage (solo en browser)
   * Actualiza el BehaviorSubject para notificar a componentes suscritos
   * @param user - Usuario a establecer como actual
   */
  private setCurrentUser(user: User): void {
    /* Solo persistir en localStorage si estamos en el browser */
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));  /* Persistir en localStorage */
    }
    this.currentUserSubject.next(user);                         /* Notificar cambio a suscritos */
  }

  /**
   * Recupera el usuario guardado en localStorage al inicializar la aplicación
   * Solo funciona en browser - en SSR devuelve null
   * @returns Usuario guardado en localStorage o null si no existe o estamos en servidor
   */
  private getUserFromStorage(): User | null {
    /* Solo intentar acceder a localStorage en el browser */
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    }
    /* En SSR, devolver null (no hay sesión persistente) */
    return null;
  }
} 