import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notice {
  id?: number;
  titular: string;
  notice: string;
  dateYear: string;
  miniature: string;
  username: string;
  license: string;
}

@Injectable({
  providedIn: 'root'
})
export class TestNoticeService {
  private apiUrl = 'http://localhost:8080/Notice';

  constructor(private http: HttpClient) {}

  createNotice(notice: Notice): Observable<any> {
    return this.http.post<any>(this.apiUrl, notice);
  }

  getNotices(): Observable<Notice[]> {
    return this.http.get<Notice[]>(this.apiUrl);
  }
} 