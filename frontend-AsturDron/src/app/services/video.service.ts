import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VideoDTO {
  username: string;
  miniature: string;
  video: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiUrl = 'http://localhost:8080/Videos';

  constructor(private http: HttpClient) { }

  getAllVideos(): Observable<VideoDTO[]> {
    return this.http.get<VideoDTO[]>(this.apiUrl);
  }

  uploadVideo(username: string, miniatureUrl: string, videoUrl: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/upload/${username}`, null, {
      params: {
        miniature: miniatureUrl,
        video: videoUrl
      }
    });
  }

  deleteVideo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 