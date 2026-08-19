import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, defer, Observable, throwError } from 'rxjs';
import { CurrentWeatherResponse, ForecastResponse } from '../models/weather.model';
import { environment } from '../../environments/environment';

export class WeatherServiceError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api.openweathermap.org/data/2.5';

  readonly apiKey = signal(environment.openWeatherApiKey);

  getCurrentWeather(city: string): Observable<CurrentWeatherResponse> {
    return defer(() =>
      this.http.get<CurrentWeatherResponse>(`${this.apiUrl}/weather`, {
        params: this.createParams(city),
      }),
    ).pipe(catchError((error: unknown) => this.handleError(error)));
  }

  getForecast(city: string): Observable<ForecastResponse> {
    return defer(() =>
      this.http.get<ForecastResponse>(`${this.apiUrl}/forecast`, {
        params: this.createParams(city),
      }),
    ).pipe(catchError((error: unknown) => this.handleError(error)));
  }

  private createParams(city: string): HttpParams {
    const normalizedCity = city.trim();
    if (!normalizedCity) {
      throw new WeatherServiceError('Please enter a city name.');
    }
    if (!this.apiKey()) {
      throw new WeatherServiceError('An OpenWeatherMap API key is required.');
    }

    return new HttpParams()
      .set('q', normalizedCity)
      .set('appid', this.apiKey())
      .set('units', 'metric');
  }

  private handleError(error: unknown): Observable<never> {
    if (error instanceof WeatherServiceError) {
      return throwError(() => error);
    }

    if (error instanceof HttpErrorResponse) {
      const message =
        error.status === 400
          ? 'The weather request was invalid. Check the city name and try again.'
          : error.status === 401
            ? 'The OpenWeatherMap API key is invalid or not active.'
            : error.status === 403
              ? 'The OpenWeatherMap API key is not authorized for this request.'
              : error.status === 404
                ? 'City not found. Check the spelling and try again.'
                : error.status === 429
                  ? 'The weather service rate limit was reached. Try again shortly.'
                  : error.status === 0
                    ? 'Unable to reach the weather service. Check your network connection.'
                    : 'The weather service could not process the request.';
      return throwError(() => new WeatherServiceError(message, error.status));
    }

    return throwError(() => new WeatherServiceError('Unable to load weather data.'));
  }
}
