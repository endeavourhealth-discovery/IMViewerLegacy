import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AppConfig} from '../app-config.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  constructor(
    private router: Router,
    public appConfig: AppConfig
  ) { }

  ngOnInit() {
    this.appConfig.subtitle = '';
  }

  logout() {
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
