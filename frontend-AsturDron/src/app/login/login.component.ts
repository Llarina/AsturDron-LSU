import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Componente de Inicio de Sesión
 * 
 * Este componente proporciona la interfaz para que los usuarios existentes
 * puedan iniciar sesión en el sistema.
 * 
 * Funcionalidades principales:
 * - Formulario de login con validación básica
 * - Autenticación contra el backend
 * - Redirección automática tras login exitoso
 * - Manejo de errores de autenticación
 * - Enlace para registro de nuevos usuarios
 * 
 * Funcionalidades especiales:
 * - Navegación automática a la página principal tras éxito
 * - Mensajes de error específicos para credenciales incorrectas
 * - Limpieza de formulario en caso de error
 * - Integración con sistema de routing y guards
 */
@Component({
  selector: 'app-login', 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  // === CAMPOS DEL FORMULARIO ===
  
  /* Nombre de usuario introducido por el usuario */
  username: string = '';
  
  /* Contraseña introducida por el usuario */
  password: string = '';

  // === ESTADO DEL COMPONENTE ===
  
  /* Mensaje de error a mostrar al usuario en caso de fallo */
  errorMessage: string = '';
  
  /* Indica si hay una operación de login en curso */
  isLoading: boolean = false;

  /**
   * Constructor del componente
   * @param authService - Servicio de autenticación para gestionar login
   * @param router - Router de Angular para navegación tras login exitoso
   */
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Maneja el envío del formulario de login
   * Valida los campos y realiza la autenticación con el backend
   */
  onSubmit() {
    /* Validación básica de campos obligatorios */
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    /* Iniciar proceso de login */
    this.isLoading = true;
    this.errorMessage = ''; /* Limpiar errores previos */

    /* Llamar al servicio de autenticación */
    this.authService.login(this.username.trim(), this.password).subscribe({
      next: (user) => {
        /* Login exitoso - navegar a página principal */
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        /* Login fallido - mostrar error al usuario */
        this.isLoading = false;
        this.handleLoginError(error);
      }
    });
  }

  /**
   * Navega a la página de registro de nuevos usuarios
   */
  goToRegister() {
    this.router.navigate(['/register']);
  }

  /**
   * Maneja los errores de login de forma centralizada
   * Proporciona mensajes específicos según el tipo de error
   * @param error - Error recibido del servicio de autenticación
   */
  private handleLoginError(error: any) {
    console.error('Error en login:', error);
    
    /* Verificar si el error tiene información específica del backend */
    if (error.error && error.error.errorType) {
      switch (error.error.errorType) {
        case 'INVALID_USERNAME':
          this.errorMessage = 'El nombre de usuario no existe. Verifica que esté escrito correctamente.';
          break;
        case 'INVALID_PASSWORD':
          this.errorMessage = 'La contraseña es incorrecta. Inténtalo de nuevo.';
          break;
        default:
          this.errorMessage = 'Error de autenticación. Verifica tus credenciales.';
      }
    } else {
      /* Manejo de errores genéricos según código de estado HTTP */
      if (error.status === 401) {
        this.errorMessage = 'Usuario o contraseña incorrectos.';
      } else if (error.status === 404) {
        this.errorMessage = 'Usuario no encontrado.';
      } else if (error.status === 0) {
        this.errorMessage = 'No se puede conectar con el servidor. Inténtalo más tarde.';
      } else {
        this.errorMessage = 'Error al iniciar sesión. Inténtalo de nuevo.';
      }
    }
    
    /* Limpiar contraseña por seguridad en caso de error */
    this.password = '';
  }
} 