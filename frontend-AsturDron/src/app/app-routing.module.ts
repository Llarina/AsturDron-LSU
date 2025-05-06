import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';

const routes: Routes = [
   { path: 'inicio', component: InicioComponent },
   { path: '', redirectTo: '/inicio', pathMatch: 'full' } // Redirige a inicio por defecto
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
