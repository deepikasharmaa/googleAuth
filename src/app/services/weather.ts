import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { secrets } from '../../env/secrets';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = secrets.weatherApiKey;
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) { }

  getWeatherForCities(cities: string[]): Observable<any[]> {
    const requests = cities.map(city =>
      this.http.get(`${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`)
    );
    return forkJoin(requests);
  }
}
