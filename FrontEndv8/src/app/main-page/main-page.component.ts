import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Perspectives} from '../services/perspective.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  constructor(
    private router: Router,
    public perspectives: Perspectives
  ) { }

  ngOnInit() {
    this.perspectives.current = null;
  }

  logout() {
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
