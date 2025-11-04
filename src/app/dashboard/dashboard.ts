import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../services/weather';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  user: any;
  weatherData: any[] = [];
  loading = true;

  cities = ['Bangalore', 'Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bhopal'];

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    this.weatherService.getWeatherForCities(this.cities).subscribe({
      next: (data) => {
        this.weatherData = data;
        console.log('Weather Data:', this.weatherData);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading weather data:', err);
        this.loading = false;
      }
    });
  }

  logout() {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}
