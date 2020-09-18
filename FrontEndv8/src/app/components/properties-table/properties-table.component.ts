import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-properties-table',
  templateUrl: './properties-table.component.html',
  styleUrls: ['./properties-table.component.scss']
})
export class PropertiesTableComponent implements OnInit {
  @Input() properties: [];
  displayedColumns: string[] = ['name', 'type', 'cardinality'];

  constructor() { }

  ngOnInit() {
  }

}
