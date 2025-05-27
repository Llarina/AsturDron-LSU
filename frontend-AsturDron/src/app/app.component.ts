import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InicioSesionComponent } from "./inicio-sesion/inicio-sesion.component";
import { NoticiasComponent } from "./noticias/noticias.component";
import { OcioComponent } from "./ocio/ocio.component";
import { MeteorologiaComponent } from "./meteorologia/meteorologia.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InicioSesionComponent, NoticiasComponent, OcioComponent, MeteorologiaComponent, HeaderComponent, FooterComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend-AsturDron';
}
