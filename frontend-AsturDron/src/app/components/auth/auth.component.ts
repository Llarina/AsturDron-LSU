import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isRegistering = false;
  error = '';

  loginData = {
    username: '',
    password: ''
  };

  registerData = {
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
    this.authService.login(this.loginData.username, this.loginData.password).subscribe({
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
    const userData: User = {
      username: this.registerData.username,
      userEmail: this.registerData.userEmail,
      password: this.registerData.password,
      license: this.registerData.license
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        if (err.status === 400) {
          if (err.error.message.includes('nombre de usuario')) {
            this.error = 'El nombre de usuario ya está en uso';
          } else if (err.error.message.includes('email')) {
            this.error = 'El email ya está en uso';
          } else {
            this.error = err.error.message;
          }
        } else {
          this.error = 'Error al registrarse. Por favor, verifica los datos ingresados.';
        }
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