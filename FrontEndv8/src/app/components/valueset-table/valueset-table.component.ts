import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-valueset-table',
  templateUrl: './valueset-table.component.html',
  styleUrls: ['./valueset-table.component.scss']
})
export class ValuesetTableComponent implements OnInit {
  @Input() valuesets: [];
  displayedColumns: string[] = ['name', 'code'];

  constructor() { }

  ngOnInit() {
  }

}
