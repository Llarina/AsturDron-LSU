import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface NoticeDTO {
  titular: string;
  notice: string;
  dateYear: string;
  miniature?: string;
  showDetails?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  private apiUrl = 'http://localhost:8080/Notice';

  constructor(private http: HttpClient) { }

  getNotices(license: string): Observable<NoticeDTO[]> {
    const url = license === 'any' ? this.apiUrl : `${this.apiUrl}/license?license=${license}`;
    return this.http.get<NoticeDTO[]>(url).pipe(
      map(notices => notices.map(notice => ({
        ...notice,
        showDetails: false
      })))
    );
  }
} 