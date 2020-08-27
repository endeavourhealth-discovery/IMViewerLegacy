import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  constructor(
    private auth: KeycloakService,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  logout() {
    this.auth.logout();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
