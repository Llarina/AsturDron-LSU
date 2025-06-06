import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticiasComponent } from '../../noticias/noticias.component';
import { OcioComponent } from '../../ocio/ocio.component';
import { MeteorologiaComponent } from '../../meteorologia/meteorologia.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NoticiasComponent, OcioComponent, MeteorologiaComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {} 