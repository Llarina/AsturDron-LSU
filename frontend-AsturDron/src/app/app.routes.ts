import { Routes } from '@angular/router';
import { NoticiasComponent } from './noticias/noticias.component';
import { OcioComponent } from './ocio/ocio.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { MeteorologiaComponent } from './meteorologia/meteorologia.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/noticias', pathMatch: 'full' },
    { path: 'noticias', component: NoticiasComponent },
    { path: 'ocio', component: OcioComponent, canActivate: [AuthGuard] },
    { path: 'meteorologia', component: MeteorologiaComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }
];
