import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

/**
 * Componente de Registro de Usuarios
 * 
 * Este componente proporciona la interfaz para que nuevos usuarios se registren
 * en el sistema con sus datos personales y licencia de dron.
 * 
 * Funcionalidades principales:
 * - Formulario completo de registro con todos los campos necesarios
 * - Selección de tipo de licencia de dron (A1, A2, A3 o ninguna)
 * - Validación de campos obligatorios
 * - Registro automático con el backend
 * - Manejo específico de errores de campo duplicado
 * - Redirección automática tras registro exitoso
 * 
 * Funcionalidades especiales:
 * - Template inline para facilitar mantenimiento
 * - Estilos CSS consistentes con el tema de la aplicación
 * - Selector de licencia con opciones específicas de drones
 * - Auto-login tras registro exitoso
 * - Navegación automática a página principal
 * - Mensajes de error específicos por campo
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  /* Objeto que contiene todos los datos del formulario de registro */
  registerData = {
    username: '',      /* Nombre de usuario único */
    userEmail: '',     /* Dirección de email del usuario */
    password: '',      /* Contraseña para el acceso */
    license: 'any'     /* Tipo de licencia de dron seleccionada */
  };

  /* Mensaje de error a mostrar al usuario */
  errorMessage: string = '';

  /* Indica si hay una operación de registro en curso */
  isLoading: boolean = false;

  /**
   * Constructor del componente
   * @param authService - Servicio de autenticación para gestionar el registro
   * @param router - Router de Angular para navegación tras registro exitoso
   */
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Maneja el envío del formulario de registro
   * Realiza el registro con el backend y navega en caso de éxito
   */
  onSubmit() {
    /* Validación básica de campos obligatorios */
    if (!this.registerData.username.trim() || 
        !this.registerData.userEmail.trim() || 
        !this.registerData.password.trim()) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios.';
      return;
    }

    /* Validación básica de email */
    if (!this.isValidEmail(this.registerData.userEmail)) {
      this.errorMessage = 'Por favor, introduce un email válido.';
      return;
    }

    /* Iniciar proceso de registro */
    this.isLoading = true;
    this.errorMessage = ''; /* Limpiar errores previos */

    this.authService.register(this.registerData).subscribe({
      next: () => {
        /* Registro exitoso - el AuthService ya maneja el auto-login */
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        /* Registro fallido - mostrar error específico al usuario */
        this.isLoading = false;
        this.handleRegisterError(error);
      }
    });
  }

  /**
   * Maneja los errores de registro de forma centralizada
   * Proporciona mensajes específicos según el tipo de error
   * @param error - Error recibido del servicio de autenticación
   */
  private handleRegisterError(error: any) {
    console.error('Error al registrarse:', error);
    
    /* Verificar si el error tiene información específica del backend */
    if (error.error && error.error.errorType) {
      switch (error.error.errorType) {
        case 'DUPLICATE_USERNAME':
          this.errorMessage = 'Este nombre de usuario ya está en uso. Elige otro.';
          break;
        case 'DUPLICATE_EMAIL':
          this.errorMessage = 'Este email ya está registrado. Usa otro email.';
          break;
        case 'INVALID_EMAIL':
          this.errorMessage = 'El formato del email no es válido.';
          break;
        default:
          this.errorMessage = 'Error en el registro. Verifica los datos e inténtalo de nuevo.';
      }
    } else {
      /* Manejo de errores genéricos según código de estado HTTP */
      if (error.status === 409) {
        this.errorMessage = 'Usuario o email ya existente. Prueba con datos diferentes.';
      } else if (error.status === 0) {
        this.errorMessage = 'No se puede conectar con el servidor. Inténtalo más tarde.';
      } else {
        this.errorMessage = 'Error al registrarse. Inténtalo de nuevo.';
      }
    }
    
    this.registerData.password = '';
  }

  /**
   * Valida si un email tiene formato correcto
   * @param email - Email a validar
   * @returns true si el email es válido, false en caso contrario
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}