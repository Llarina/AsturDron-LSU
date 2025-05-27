import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface NoticeDTO {
  titular: string;
  notice: string;
  dateYear: string;
  showDetails?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  private apiUrl = 'http://localhost:8080/Notice'; // Ajustado a la ruta correcta del backend

  constructor(private http: HttpClient) { }

  getNotices(license: string): Observable<NoticeDTO[]> {
    return this.http.get<NoticeDTO[]>(`${this.apiUrl}`, {
      params: { license } // Añadiendo el parámetro license como query parameter
    }).pipe(
      map(notices => notices.map(notice => ({
        ...notice,
        showDetails: false
      })))
    );
  }
} 