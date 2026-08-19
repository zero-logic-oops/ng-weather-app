export interface Coordinates {
  readonly lon: number;
  readonly lat: number;
}

export interface WeatherCondition {
  readonly id: number;
  readonly main: string;
  readonly description: string;
  readonly icon: string;
}

export interface MainWeatherData {
  readonly temp: number;
  readonly feels_like: number;
  readonly temp_min: number;
  readonly temp_max: number;
  readonly pressure: number;
  readonly humidity: number;
  readonly sea_level?: number;
  readonly grnd_level?: number;
}

export interface WindData {
  readonly speed: number;
  readonly deg: number;
  readonly gust?: number;
}

export interface CurrentWeatherResponse {
  readonly coord: Coordinates;
  readonly weather: readonly WeatherCondition[];
  readonly base: string;
  readonly main: MainWeatherData;
  readonly visibility?: number;
  readonly wind: WindData;
  readonly clouds: { readonly all: number };
  readonly dt: number;
  readonly sys: {
    readonly type?: number;
    readonly id?: number;
    readonly country: string;
    readonly sunrise: number;
    readonly sunset: number;
  };
  readonly timezone: number;
  readonly id: number;
  readonly name: string;
  readonly cod: number;
}

export interface ForecastItem {
  readonly dt: number;
  readonly main: MainWeatherData;
  readonly weather: readonly WeatherCondition[];
  readonly clouds: { readonly all: number };
  readonly wind: WindData;
  readonly visibility?: number;
  readonly pop: number;
  readonly rain?: { readonly '3h'?: number };
  readonly snow?: { readonly '3h'?: number };
  readonly sys: { readonly pod: string };
  readonly dt_txt: string;
}

export interface ForecastResponse {
  readonly cod: string;
  readonly message: number;
  readonly cnt: number;
  readonly list: readonly ForecastItem[];
  readonly city: {
    readonly id: number;
    readonly name: string;
    readonly coord: Coordinates;
    readonly country: string;
    readonly population: number;
    readonly timezone: number;
    readonly sunrise: number;
    readonly sunset: number;
  };
}
