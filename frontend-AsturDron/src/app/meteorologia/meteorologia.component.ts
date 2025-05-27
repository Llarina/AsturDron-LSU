import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, WeatherDTO } from '../services/weather.service';

@Component({
  selector: 'app-meteorologia',
  templateUrl: './meteorologia.component.html',
  styleUrls: ['./meteorologia.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MeteorologiaComponent implements OnInit {
  weatherDays: WeatherDTO[] = [];
  error: string = '';
  warningMessage: string = '';
  daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.loadWeatherData();
  }

  loadWeatherData() {
    this.weatherService.getWeatherDays().subscribe({
      next: (data) => {
        console.log('Datos del clima recibidos:', data);
        this.weatherDays = data;
        this.checkWeatherWarning();
      },
      error: (err) => {
        console.error('Error loading weather data:', err);
        this.error = 'Error al cargar los datos meteorológicos';
      }
    });
  }

  checkWeatherWarning() {
    if (!this.weatherDays.length) return;
    
    const todayWeather = this.weatherDays[0]?.weather?.toLowerCase();
    const adverseConditions = ['rainy', 'stormy', 'windy'];
    
    if (todayWeather && adverseConditions.includes(todayWeather)) {
      this.warningMessage = '⚠️ PROHIBIDO VOLAR HOY: Condiciones meteorológicas adversas';
    } else {
      this.warningMessage = '';
    }
  }

  getWeatherIcon(weather: string | undefined): string {
    if (!weather) return 'fas fa-question';
    
    const weatherType = weather.toLowerCase().trim();
    console.log('Tipo de clima recibido:', weatherType);
    
    switch (weatherType) {
      case 'sunny':
        return 'fas fa-sun';
      case 'windy':
        return 'fas fa-wind';
      case 'rainy':
        return 'fas fa-cloud-rain';
      case 'stormy':
        return 'fas fa-bolt';
      case 'cloudy':
        return 'fas fa-cloud';
      default:
        console.log('Tipo de clima no reconocido:', weatherType);
        return 'fas fa-question';
    }
  }

  getDayInfo(index: number): { dayNumber: number; dayName: string } {
    const today = new Date();
    const futureDate = new Date(today);
    // No sumamos días para el índice 0, así mostrará el día actual
    if (index > 0) {
      futureDate.setDate(today.getDate() + index);
    }
    
    return {
      dayNumber: futureDate.getDate(),
      dayName: this.daysOfWeek[futureDate.getDay()]
    };
  }
}
