import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ImageDTO {
  username: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://localhost:8080/images';

  constructor(private http: HttpClient) { }

  getAllImages(): Observable<ImageDTO[]> {
    return this.http.get<ImageDTO[]>(this.apiUrl);
  }

  uploadImage(username: string, url: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload/${username}`, null, {
      params: { url }
    });
  }
} 