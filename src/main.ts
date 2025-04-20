import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { AppComponentComponent } from './app/app-component/app-component.component';
bootstrapApplication(AppComponentComponent, appConfig)
  .catch((err) => console.error(err));