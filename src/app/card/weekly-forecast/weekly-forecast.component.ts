import { Component, OnInit } from '@angular/core';
import {AppState, selectWeather} from "../../reducers";
import {select, Store} from "@ngrx/store";
import {WeatherData} from "../../models/weather-data/weather-data";
import {Observable} from "rxjs";

@Component({
  selector: 'app-weekly-forecast',
  templateUrl: './weekly-forecast.component.html',
  styleUrls: ['./weekly-forecast.component.css']
})
export class WeeklyForecastComponent implements OnInit {

  data$: Observable<WeatherData>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.data$ = this.store.pipe(select(selectWeather));
  }
}
