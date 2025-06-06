import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

/**
 * Componente de Inicio de Sesión
 * 
 * Este componente proporciona la interfaz para que los usuarios existentes
 * puedan iniciar sesión en el sistema mediante un formulario reactivo.
 * 
 * Funcionalidades principales:
 * - Formulario de login con template y estilos inline
 * - Autenticación contra el backend usando AuthService
 * - Redirección automática a la página principal tras login exitoso
 * - Validación básica de campos requeridos con Angular Forms
 * - Manejo específico de errores de autenticación
 * - Diseño responsive y accesible
 * 
 * Funcionalidades especiales:
 * - Template inline para facilitar mantenimiento
 * - Estilos CSS inline con tema consistente de la aplicación
 * - Navegación automática tras autenticación exitosa
 * - Mensajes de error específicos para usuario inexistente vs contraseña incorrecta
 * - Integración con sistema de routing de Angular
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /* Objeto que contiene los datos del formulario de login */
  loginData = {
    username: '',    /* Nombre de usuario introducido */
    password: ''     /* Contraseña introducida */
  };

  /* Mensaje de error a mostrar al usuario */
  errorMessage: string = '';

  /* Indica si hay una operación de login en curso */
  isLoading: boolean = false;

  /**
   * Constructor del componente
   * @param authService - Servicio de autenticación para gestionar el login
   * @param router - Router de Angular para navegación tras login exitoso
   */
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Maneja el envío del formulario de login
   * Realiza la autenticación con el backend y navega en caso de éxito
   */
  onSubmit() {
    /* Validación básica de campos obligatorios */
    if (!this.loginData.username.trim() || !this.loginData.password.trim()) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    /* Iniciar proceso de login */
    this.isLoading = true;
    this.errorMessage = ''; /* Limpiar errores previos */

    this.authService.login(this.loginData.username.trim(), this.loginData.password).subscribe({
      next: () => {
        /* Login exitoso - navegar a la página principal */
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        /* Login fallido - mostrar error específico al usuario */
        this.isLoading = false;
        this.handleLoginError(error);
      }
    });
  }

  /**
   * Maneja los errores de login de forma centralizada
   * Proporciona mensajes específicos según el tipo de error
   * @param error - Error recibido del servicio de autenticación
   */
  private handleLoginError(error: any) {
    console.error('Error al iniciar sesión:', error);
    
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
      } else if (error.status === 0) {
        this.errorMessage = 'No se puede conectar con el servidor. Inténtalo más tarde.';
      } else {
        this.errorMessage = 'Error al iniciar sesión. Inténtalo de nuevo.';
      }
    }
    
    /* Limpiar contraseña por seguridad en caso de error */
    this.loginData.password = '';
  }
} 