import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticeService, NoticeDTO } from '../services/notice.service';

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

  constructor(private noticeService: NoticeService) {}

  ngOnInit() {
    const license = 'a1';
    this.loadNotices(license);
  }

  toggleDetails(notice: NoticeDTO) {
    notice.showDetails = !notice.showDetails;
  }

  private loadNotices(license: string) {
    this.noticeService.getNotices(license).subscribe({
      next: (data) => {
        this.notices = data.map(notice => ({
          ...notice,
          showDetails: false
        }));
      },
      error: (err) => {
        console.error('Error loading notices:', err);
        this.error = 'Error al cargar las noticias';
      }
    });
  }
}
