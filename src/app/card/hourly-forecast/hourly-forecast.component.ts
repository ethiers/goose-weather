import { Component, OnInit } from '@angular/core';
import {select, Store} from "@ngrx/store";
import {AppState, selectWeather} from "../../reducers";
import {Observable} from "rxjs";
import {WeatherData} from "../../models/weather-data/weather-data";

@Component({
  selector: 'app-hourly-forecast',
  templateUrl: './hourly-forecast.component.html',
  styleUrls: ['./hourly-forecast.component.css']
})
export class HourlyForecastComponent implements OnInit {

  displayedColumns: string[] = ['Time', 'Temp', 'Wind', 'Condition'];

  private data$: Observable<WeatherData>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.data$ = this.store.pipe(select(selectWeather));
  }

}
