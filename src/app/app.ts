import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { CurrentWeatherResponse, ForecastItem, ForecastResponse } from './models/weather.model';
import { WeatherService } from './services/weather';

@Component({
  selector: 'app-root',
  imports: [DecimalPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly weatherService = inject(WeatherService);
  protected readonly city = signal('');
  protected readonly isConfigured = computed(() => Boolean(this.weatherService.apiKey()));
  protected readonly currentWeather = signal<CurrentWeatherResponse | null>(null);
  protected readonly forecast = signal<ForecastResponse | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly isLoading = signal(false);

  protected updateCity(event: Event): void {
    this.city.set((event.target as HTMLInputElement).value);
  }
  protected search(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);
    this.weatherService.getCurrentWeather(this.city()).subscribe({
      next: (weather) => this.currentWeather.set(weather),
      error: (error: Error) => this.showError(error),
      complete: () => this.loadForecast(),
    });
  }

  protected iconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
  protected formatDay(item: ForecastItem): string {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(item.dt * 1000));
  }
  protected formatTime(timestamp: number): string {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(
      new Date(timestamp * 1000),
    );
  }

  private loadForecast(): void {
    this.weatherService.getForecast(this.city()).subscribe({
      next: (forecast) => this.forecast.set(forecast),
      error: (error: Error) => this.showError(error),
      complete: () => this.isLoading.set(false),
    });
  }

  private showError(error: Error): void {
    this.errorMessage.set(error.message);
    this.currentWeather.set(null);
    this.forecast.set(null);
    this.isLoading.set(false);
  }
}
