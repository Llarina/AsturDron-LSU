import { Routes } from '@angular/router';
import { NoticiasComponent } from './noticias/noticias.component';
import { OcioComponent } from './ocio/ocio.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { MeteorologiaComponent } from './meteorologia/meteorologia.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'noticias', component: NoticiasComponent },
    { path: 'ocio', component: OcioComponent },
    { path: 'meteorologia', component: MeteorologiaComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] }
];
