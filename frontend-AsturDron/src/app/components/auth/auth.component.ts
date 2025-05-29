import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, LoginRequest, RegisterRequest } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-box">
        <div class="auth-header">
          <button [class.active]="!isRegistering" (click)="isRegistering = false">Iniciar Sesión</button>
          <button [class.active]="isRegistering" (click)="isRegistering = true">Registrarse</button>
        </div>

        <!-- Formulario de Login -->
        <form *ngIf="!isRegistering" (ngSubmit)="onLogin()" class="auth-form">
          <div class="form-group">
            <label for="loginUsername">Usuario</label>
            <input 
              type="text" 
              id="loginUsername"
              [(ngModel)]="loginData.username"
              name="username"
              required>
          </div>

          <div class="form-group">
            <label for="loginPassword">Contraseña</label>
            <input 
              type="password" 
              id="loginPassword"
              [(ngModel)]="loginData.password"
              name="password"
              required>
          </div>

          <button type="submit" [disabled]="!loginData.username || !loginData.password">
            Iniciar Sesión
          </button>

          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>
        </form>

        <!-- Formulario de Registro -->
        <form *ngIf="isRegistering" (ngSubmit)="onRegister()" class="auth-form">
          <div class="form-group">
            <label for="registerUsername">Usuario</label>
            <input 
              type="text" 
              id="registerUsername"
              [(ngModel)]="registerData.username"
              name="username"
              required>
          </div>

          <div class="form-group">
            <label for="registerEmail">Email</label>
            <input 
              type="email" 
              id="registerEmail"
              [(ngModel)]="registerData.userEmail"
              name="email"
              required>
          </div>

          <div class="form-group">
            <label for="registerPassword">Contraseña</label>
            <input 
              type="password" 
              id="registerPassword"
              [(ngModel)]="registerData.password"
              name="password"
              required>
          </div>

          <div class="form-group">
            <label for="registerLicense">Licencia</label>
            <select 
              id="registerLicense"
              [(ngModel)]="registerData.license"
              name="license"
              required>
              <option value="a1">A1</option>
              <option value="a2">A2</option>
              <option value="a3">A3</option>
            </select>
          </div>

          <button type="submit" [disabled]="!isRegisterFormValid()">
            Registrarse
          </button>

          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 20px;
    }

    .auth-box {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .auth-header {
      display: flex;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
    }

    .auth-header button {
      flex: 1;
      padding: 10px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 16px;
      color: #666;
    }

    .auth-header button.active {
      color: #007bff;
      border-bottom: 2px solid #007bff;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    label {
      font-size: 14px;
      color: #666;
    }

    input, select {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    button[type="submit"] {
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }

    button[type="submit"]:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .error-message {
      color: #dc3545;
      font-size: 14px;
      margin-top: 10px;
      text-align: center;
    }
  `]
})
export class AuthComponent {
  isRegistering = false;
  error = '';

  loginData: LoginRequest = {
    username: '',
    password: ''
  };

  registerData: RegisterRequest = {
    username: '',
    userEmail: '',
    password: '',
    license: 'a1'
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.error = '';
    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error en el login:', err);
        this.error = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
      }
    });
  }

  onRegister() {
    this.error = '';
    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        this.error = 'Error al registrarse. Por favor, verifica los datos ingresados.';
      }
    });
  }

  isRegisterFormValid(): boolean {
    return !!(
      this.registerData.username &&
      this.registerData.userEmail &&
      this.registerData.password &&
      this.registerData.license
    );
  }
} 