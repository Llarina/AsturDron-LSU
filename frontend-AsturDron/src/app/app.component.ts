import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav>
      <div class="nav-links">
        <a routerLink="/noticias" routerLinkActive="active">Noticias</a>
        <a routerLink="/ocio" routerLinkActive="active">Ocio</a>
      </div>
      <div class="auth-section">
        <ng-container *ngIf="authService.currentUser$ | async as user">
          <span class="username">&#64;{{ user.username }}</span>
          <button class="logout-btn" (click)="logout()">Cerrar Sesión</button>
        </ng-container>
        <a *ngIf="!(authService.currentUser$ | async)" 
           routerLink="/auth" 
           class="login-btn"
           routerLinkActive="active">
          Iniciar Sesión
        </a>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    nav {
      background-color: #333;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-links {
      display: flex;
      gap: 1rem;
    }

    .auth-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }

    a:hover {
      background-color: #444;
    }

    a.active {
      background-color: #007bff;
    }

    .username {
      color: #fff;
      font-weight: bold;
    }

    .logout-btn {
      padding: 0.5rem 1rem;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .logout-btn:hover {
      background-color: #c82333;
    }

    .login-btn {
      background-color: #007bff;
    }

    .login-btn:hover {
      background-color: #0056b3;
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
