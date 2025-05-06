import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { OcioComponent } from './ocio/ocio.component';
import { MeteorologiaComponent } from './meteorologia/meteorologia.component';



@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    OcioComponent,
    MeteorologiaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
