import {Component, Input, OnInit} from '@angular/core';
import {WeatherData} from '../../models/weather-data/weather-data';
import {AppState, selectWeather} from "../../reducers";
import {select, Store} from "@ngrx/store";
import {Observable} from "rxjs";

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent implements OnInit {

  data$: Observable<WeatherData>;

  // @Input()
  // set weatherData(weatherData: WeatherData) {
  //   this.data = weatherData || null;
  // }

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    this.data$ = this.store.pipe(select(selectWeather));
  }

}
