import {Injectable} from '@angular/core';
import {WeatherData} from '../models/weather-data/weather-data';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {LocationData} from '../models/location-data/location-data';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {WeeklyForecast} from '../models/weekly-forecast/weekly-forecast';
import {HourlyForecast} from '../models/hourly-forecast/hourly-forecast';
import {logger} from "codelyzer/util/logger";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  weatherData: WeatherData = new WeatherData();

  constructor(private http: HttpClient) {
  }

  getWeather(locationData: LocationData): Observable<any> {
    return this.getNoaaWeeklyForecast(locationData)
          .pipe(
            mergeMap(weeklyForecast => {
              console.log('weeklyForecast', weeklyForecast);
              return this.getWeatherOnceCall(locationData)
                    .pipe(
                      map((currentWeather) => {
                        // metadata
                        this.weatherData.currentConditions.latitude = locationData.latitude;
                        this.weatherData.currentConditions.longitude = locationData.longitude;
                        this.weatherData.currentConditions.city = weeklyForecast.city.name;
                        this.weatherData.currentConditions.state = weeklyForecast.city.country;

                        // weekly forecast
                        this.weatherData.weeklyForecast = this.createWeeklyForecastFromNoaaData(weeklyForecast.list);

                        // hourly forecast
                        this.weatherData.hourlyForecast = this.createHourlyForecastFromNoaaData(currentWeather.hourly);

                        // current conditions
                        this.weatherData.currentConditions.temp = String(Math.ceil(currentWeather.current.temp));
                        this.weatherData.currentConditions.description = currentWeather.current.weather[0].description;
                        this.weatherData.currentConditions.sunrise = this.createDateFromMillseconds(currentWeather.current.sunrise);
                        this.weatherData.currentConditions.sunset = this.createDateFromMillseconds(currentWeather.current.sunset);
                        this.weatherData.currentConditions.icon = this.selectCurrentConditionsIcon(currentWeather.current.weather[0].icon);
                        this.weatherData.currentConditions.windSpeed = currentWeather.current.wind_speed;
                        this.weatherData.currentConditions.windDirection = this.getWindDirectionFromDegreeAngle(currentWeather.current.wind_deg);

                        // save time that the weather was retrieved
                        this.weatherData.weatherDate = new Date();
                        console.log(this.weatherData);
                        return this.weatherData;
                      }))
            }));
  }

  getWeatherLocalStorage(): Observable<WeatherData> {
    const localStorageWeatherData: WeatherData = JSON.parse(window.localStorage.getItem('weather'));
    return of(localStorageWeatherData);
  }

  // method implementation copied from angular documentation
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // clientside
      console.error('An error occurred:', error.error.message);
    } else {
      // backend
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // custom error to be caught
    return throwError(
      'An error occured when calling APIs');
  }

  getWindDirectionFromDegreeAngle(degreeAngle: number): string {
    // Open Weather Map API returns an angle so where it falls in with cartesian quadrants is the direction here
    // helpful background is here https://en.wikipedia.org/wiki/Wind_direction
    let windDirection: string;
    if (degreeAngle >= 0 && degreeAngle < 90) {
      // first quadrant
      windDirection = 'NE';
    } else if (degreeAngle >= 90 && degreeAngle < 180) {
      // second quadrant
      windDirection = 'SE';
    } else if (degreeAngle >= 180 && degreeAngle < 270) {
      // second quadrant
      windDirection = 'SW';
    } else if (degreeAngle >= 270 && degreeAngle <= 360) {
      // second quadrant
      windDirection = 'NW';
    }

    return windDirection;
  }

  createDateFromMillseconds(milliseconds: number): string {
    // helpeful stackoverflow article here
    // https://stackoverflow.com/questions/8362952/output-javascript-date-in-yyyy-mm-dd-hhmsec-format
    // Note that time is Eastern Standard Format
    // Eastern Standard is 5 hours behind UTC
    const dMill = new Date(0);
    dMill.setUTCSeconds(milliseconds);
    let dateMinutes = '';
    let dateHours = '';
    let dateFormatted = '';

    // minutes
    dateMinutes = String(dMill.getUTCMinutes());
    if (dateMinutes.length < 2) {
      dateMinutes = '0' + dateMinutes;
    }

    // hours
    const hourNumber = dMill.getUTCHours() - 5;
    if (hourNumber > 12) {
      dateHours = String(hourNumber - 12);
    } else {
      dateHours = String(hourNumber);
    }
    if (dateHours.length < 2) {
      dateHours = '0' + dateHours;
    }

    if (hourNumber > 12) {
      dateFormatted = dateHours + ':' + dateMinutes + ' PM';
    } else {
      dateFormatted = dateHours + ':' + dateMinutes + ' AM';
    }

    return dateFormatted;
  }

  private getNoaaWeeklyForecast(locationData: LocationData): Observable<any> {
    const nooMetaDataEndpoint = environment.noaaMetaDataEndpoint;
    const APIKey = environment.openWeatherMapAPIKey;
    // default units are kelvin https://openweathermap.org/current
    // pass the unit imperial here to use Farenheit
    const units = 'imperial';
    const weatherURL =  nooMetaDataEndpoint + '/forecast?lat=' + locationData.latitude + '&lon=' + locationData.longitude
      + '&units=' + units + '&appid=' + APIKey;

    return this.http.get(weatherURL)
      .pipe(
        catchError(this.handleError)
      );
  }

  private getWeatherOnceCall(locationData: LocationData): Observable<any> {
    const nooMetaDataEndpoint = environment.noaaMetaDataEndpoint;
    const APIKey = environment.openWeatherMapAPIKey;
    // default units are kelvin https://openweathermap.org/current
    // pass the unit imperial here to use Farenheit
    const units = 'imperial';
    const weatherURL =  nooMetaDataEndpoint + '/onecall?lat=' + locationData.latitude + '&lon=' + locationData.longitude
      + '&exclude=minutely,daily' + '&units=' + units + '&appid=' + APIKey;
    return this.http.get(weatherURL)
      .pipe(
        catchError(this.handleError)
      );
  }

  selectCurrentConditionsIcon(iconAPI: string) {
    // official Open Weather Map API Icon Defintitions https://openweathermap.org/weather-conditions

    return '//openweathermap.org/img/wn/'  + iconAPI + '@2x.png';
  }

  createWeeklyForecastFromNoaaData(periods: any): WeeklyForecast[] {
    const weeklyForecastTotal = [];

    for (const period of periods) {
      const weeklyForecast = new WeeklyForecast();
      weeklyForecast.period = period.pop;
      weeklyForecast.name = period.dt_txt;
      weeklyForecast.temp = period.main.temp;
      weeklyForecast.windSpeed = period.wind.speed;
      weeklyForecast.windDirection = period.wind.deg;
      weeklyForecast.icon = '//openweathermap.org/img/w/' + period.weather[0].icon + '.png';
      weeklyForecast.shortForecast = period.weather[0].main;
      weeklyForecast.detailedForecast = period.weather[0].description;
      weeklyForecastTotal.push(weeklyForecast);
    }

    return weeklyForecastTotal;
  }

  createHourlyForecastFromNoaaData(periods: any): HourlyForecast[] {
    const hourlyForecastTotal = [];
    const startTime = new Date().getTime();

    let counter = 0;
    for (const period of periods) {
      if (counter === 12) {
        // only show 12 hours
        break;
      }

      const hourlyForecast = new HourlyForecast();
      hourlyForecast.temp = period.temp;
      hourlyForecast.windSpeed = period.wind_speed;
      hourlyForecast.windDirection = period.wind_deg;
      hourlyForecast.icon = '//openweathermap.org/img/w/' + period.weather[0].icon + '.png';
      // Time
      const startDate: Date = new Date(startTime + ((counter+1)*60*60*1000));
      const hoursNumber = startDate.getHours();
      let hoursDisplay = '';
      if (hoursNumber > 12) {
        hoursDisplay = String(hoursNumber - 12);
      } else {
        hoursDisplay = String(hoursNumber);
      }
      if (hoursDisplay.length === 1) {
        hoursDisplay = 0 + hoursDisplay;
      }
      if (startDate.getHours() > 12) {
        hourlyForecast.time = hoursDisplay + ':00' + ' PM';
      } else {
        hourlyForecast.time = hoursDisplay + ':00' + ' AM';
      }

      hourlyForecastTotal.push(hourlyForecast);
      counter++;
    }

    return hourlyForecastTotal;
  }
}
