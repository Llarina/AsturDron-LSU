import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RankingDTO {
  username: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private apiUrl = 'http://localhost:8080/User';

  constructor(private http: HttpClient) { }

  getRankingTop3(): Observable<RankingDTO[]> {
    return this.http.get<RankingDTO[]>(`${this.apiUrl}/RankingTop3`);
  }

  getAllRanking(): Observable<RankingDTO[]> {
    return this.http.get<RankingDTO[]>(`${this.apiUrl}/Ranking`);
  }
} 