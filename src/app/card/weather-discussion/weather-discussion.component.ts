import { Component, OnInit } from '@angular/core';
import {AppState, selectWeather} from "../../reducers";
import {select, Store} from "@ngrx/store";
import {WeatherData} from "../../models/weather-data/weather-data";
import {Observable} from "rxjs";

@Component({
  selector: 'app-weather-discussion',
  templateUrl: './weather-discussion.component.html',
  styleUrls: ['./weather-discussion.component.css']
})
export class WeatherDiscussionComponent implements OnInit {
  private data$: Observable<WeatherData>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.data$ = this.store.pipe(select(selectWeather))
  }

}
