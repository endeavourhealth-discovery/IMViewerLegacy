import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-view-switcher',
  templateUrl: './view-switcher.component.html',
  styleUrls: ['./view-switcher.component.scss']
})
export class ViewSwitcherComponent implements OnInit {
  @Input()  selectedPage: string;
  selected = '';

  constructor() { }

  ngOnInit() {
    this.selected = this.selectedPage;
  }

  changeView() {
    var landingUrl = "http://" + window.location.host + '/#' + this.selected;
    window.location.href = landingUrl;
  }

}
