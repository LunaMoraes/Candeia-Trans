import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { AppComponentComponent } from './app/app-component/app-component.component';
import { provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
bootstrapApplication(AppComponentComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
  ]
}).catch(err => console.error(err));