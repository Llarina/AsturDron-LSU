import { Routes } from '@angular/router';
import { NoticiasComponent } from './noticias/noticias.component';
import { OcioComponent } from './ocio/ocio.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/noticias', pathMatch: 'full' },
    { path: 'noticias', component: NoticiasComponent },
    { path: 'ocio', component: OcioComponent, canActivate: [AuthGuard] },
    { path: 'auth', component: AuthComponent }
];
