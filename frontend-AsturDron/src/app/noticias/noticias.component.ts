import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticeService } from '../services/notice.service';
import { NoticeDTO } from '../services/notice.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class NoticiasComponent implements OnInit {
  notices: NoticeDTO[] = [];
  error: string = '';
  selectedLicense: string = 'a1'; // Valor por defecto en minúsculas

  // Lista de licencias disponibles con valores en minúsculas
  licenses = [
    { value: 'a1', label: 'A1' },
    { value: 'a2', label: 'A2' },
    { value: 'a3', label: 'A3' },
    { value: 'any', label: 'Todas' }
  ];

  constructor(private noticeService: NoticeService) {}

  ngOnInit() {
    this.loadNotices();
  }

  loadNotices() {
    this.noticeService.getNotices(this.selectedLicense).subscribe({
      next: (data) => {
        this.notices = data;
      },
      error: (err) => {
        console.error('Error loading notices:', err);
        this.error = 'Error al cargar las noticias';
      }
    });
  }

  toggleDetails(notice: NoticeDTO) {
    notice.showDetails = !notice.showDetails;
  }

  onLicenseChange(license: string) {
    this.selectedLicense = license;
    this.loadNotices();
  }
}
