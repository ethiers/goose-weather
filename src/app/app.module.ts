import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AngularMaterialModule} from '../angular-material/angular-material.module';
import {LayoutModule} from '@angular/cdk/layout';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {NgxdModule} from '@ngxd/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { WeatherComponent } from './weather/weather.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CurrentConditionsComponent } from './card/current-conditions/current-conditions.component';
import { HourlyForecastComponent } from './card/hourly-forecast/hourly-forecast.component';
import { WeatherDiscussionComponent } from './card/weather-discussion/weather-discussion.component';
import { WeeklyForecastComponent } from './card/weekly-forecast/weekly-forecast.component';
import { AboutDesktopComponent } from './card/about-desktop/about-desktop.component';
import { AboutMobileComponent } from './card/about-mobile/about-mobile.component';

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    PageNotFoundComponent,
    CurrentConditionsComponent,
    HourlyForecastComponent,
    WeatherDiscussionComponent,
    WeeklyForecastComponent,
    AboutDesktopComponent,
    AboutMobileComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    LayoutModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    NgxdModule,
    StoreModule.forRoot(reducers, {
      metaReducers /*,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }*/
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    BrowserAnimationsModule,
    // hammerjs
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
