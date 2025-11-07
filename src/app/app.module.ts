import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RegisterComponent } from './register/register.component';
import { LOGINComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AssignresponsableComponent } from './home/Intervention/assignresponsable/assignresponsable.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HomeModule } from './home/home.module';
import { FrontofficeComponent } from './frontoffice/frontoffice.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LOGINComponent,
    AssignresponsableComponent,
    FrontofficeComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    NoopAnimationsModule,
    FullCalendarModule,
    HomeModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
