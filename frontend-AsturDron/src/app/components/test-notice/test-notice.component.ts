import { Component, OnInit } from '@angular/core';
import { TestNoticeService, Notice } from '../../services/test-notice.service';

@Component({
  selector: 'app-test-notice',
  templateUrl: './test-notice.component.html',
  styleUrls: ['./test-notice.component.css']
})
export class TestNoticeComponent implements OnInit {
  resultado: string = '';
  noticias: Notice[] = [];
  showSuccess: boolean = false;
  showError: boolean = false;

  constructor(private testNoticeService: TestNoticeService) {}

  ngOnInit(): void {
    this.verificarNoticias();
  }

  async crearNoticia(): Promise<void> {
    const noticia: Notice = {
      titular: "Noticia Frontend Test " + new Date().toISOString(),
      notice: "Esta noticia incluye el campo license requerido por el backend",
      dateYear: "2025",
      miniature: "",
      username: "admin",
      license: "any"
    };

    try {
      console.log('🚀 Enviando noticia al backend:', noticia);
      
      const result = await this.testNoticeService.createNotice(noticia).toPromise();
      this.resultado = '✅ Noticia creada exitosamente en MySQL con ID: ' + result.id;
      this.showSuccess = true;
      this.showError = false;
      
      setTimeout(() => this.verificarNoticias(), 1000);
    } catch (error: any) {
      console.error('❌ Error:', error);
      this.resultado = '❌ Error: ' + error.message;
      this.showSuccess = false;
      this.showError = true;
    }
  }

  async verificarNoticias(): Promise<void> {
    try {
      const result = await this.testNoticeService.getNotices().toPromise();
      this.noticias = result || [];
    } catch (error) {
      console.error('Error al verificar noticias:', error);
      this.noticias = [];
    }
  }
} 