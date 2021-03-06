import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {LocationData} from "../models/location-data/location-data";
import {City} from "../models/city/city";
import {WeatherData} from "../models/weather-data/weather-data";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {map} from "rxjs/operators";
import {CurrentConditionsComponent} from "../card/current-conditions/current-conditions.component";
import {HourlyForecastComponent} from "../card/hourly-forecast/hourly-forecast.component";
import {WeatherDiscussionComponent} from "../card/weather-discussion/weather-discussion.component";
import {WeeklyForecastComponent} from "../card/weekly-forecast/weekly-forecast.component";
import {AboutDesktopComponent} from "../card/about-desktop/about-desktop.component";
import {AboutMobileComponent} from "../card/about-mobile/about-mobile.component";
import {AppState, selectError} from "../reducers";
import {select, Store} from "@ngrx/store";
import {LoadLocations} from "../actions/location.actions";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {LoadWeather} from "../actions/weather.actions";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  weatherData : WeatherData;
  lat: string;
  long: string;
  cardsDesktop = [];
  cardsMobile = [];
  displayValues = false;
  spinnerColor = 'primary';
  spinnerSize = 8;
  locationData: LocationData = new LocationData();
  citiesCtrl = new FormControl();
  filteredCities: Observable<City[]>
  cities = [];
  selectedLocation = '';

  error$: Observable<any>;

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map( ({matches}) => {
      if(matches) {
        return this.cardsMobile;
      } else {
        return this.cardsDesktop;
      }
    })
  )

  constructor(private breakpointObserver: BreakpointObserver, private store: Store<AppState>) {

    console.log(breakpointObserver)

    // desktop view
    this.cardsDesktop = [
      {
        title: 'Current Conditions',
        cols: 1,
        rows: 1,
        component: CurrentConditionsComponent
      },
      {
        title: 'Hourly Forecast',
        cols: 1,
        rows: 1,
        component: HourlyForecastComponent
      },
      {
        title: 'Weather Discussion',
        cols: 1,
        rows: 2,
        component: WeatherDiscussionComponent
      },
      {
        title: 'Weekly Forecast',
        cols: 2,
        rows: 1,
        component: WeeklyForecastComponent
      },
      {
        title: 'About (desktop version)',
        cols: 3,
        rows: 1,
        component: AboutDesktopComponent
      }
    ];

    // Mobile View
    this.cardsMobile = [
      {
        title: 'Current Conditions',
        cols: 3,
        rows: 1,
        component: CurrentConditionsComponent
      },
      {
        title: 'Hourly Forecast',
        cols: 3,
        rows: 1,
        component: HourlyForecastComponent
      },
      {
        title: 'Weather Discussion',
        cols: 3,
        rows: 2,
        component: WeatherDiscussionComponent
      },
      {
        title: 'Weekly Forecast',
        cols: 3,
        rows: 1,
        component: WeeklyForecastComponent
      },
      {
        title: 'About (mobile version)',
        cols: 3,
        rows: 2,
        component: AboutMobileComponent
      }
    ];
  }

  savePosition(position) {
    this.locationData.latitude = position.coords.latitude.toFixed(4).toString();
    this.locationData.longitude = position.coords.longitude.toFixed(4).toString();
    for (const city of this.cities) {
      if (city.combinedName === '(your location)') {
        city.latitude = this.locationData.latitude;
        city.longitude = this.locationData.longitude;
      }
    }

    this.store.dispatch(new LoadLocations({locationData: this.locationData}));
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    for (const city of this.cities) {
      if (city.combinedName === event.option.value) {
        const latitude = parseFloat(city.latitude);
        const longitude = parseFloat(city.longitude);
        this.locationData.latitude = latitude.toFixed(4).toString();
        this.locationData.longitude = longitude.toFixed(4).toString();
        this.store.dispatch(new LoadWeather({weatherData: null}));
        this.store.dispatch(new LoadLocations({locationData: this.locationData}));
        break;
      }
    }
  }

  ngOnInit() {

    this.error$ = this.store.pipe(select(selectError));

    try {
      navigator.geolocation.getCurrentPosition((position) => {
        this.savePosition(position);
      });
    } catch (error) {
       alert('Browser does not support location services');
    }
  }
}
