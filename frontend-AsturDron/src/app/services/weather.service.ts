import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WeatherDTO {
  day: string;
  weather: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'http://localhost:8080/Weather';

  constructor(private http: HttpClient) { }

  getWeatherDays(): Observable<WeatherDTO[]> {
    return this.http.get<WeatherDTO[]>(this.apiUrl);
  }
} 