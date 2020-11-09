import { LoggerService } from 'dds-angular8/logger';
import { ConceptService } from '../../services/concept.service';
import { Component, OnInit, Input, SimpleChanges, SimpleChange, OnChanges } from '@angular/core';

@Component({
  selector: 'app-defintion-table',
  templateUrl: './defintion-table.component.html',
  styleUrls: ['./defintion-table.component.scss']
})
export class DefintionTableComponent implements OnInit, OnChanges {

  @Input() definitions: any[];
  displayedColumns: string[] = ['id', 'class'];


  constructor(private service: ConceptService,
              private log: LoggerService) { }

  ngOnInit() {
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.getData();
  }

  getData() {
    this.definitions.forEach(defintion => {
      const iri = defintion.Class != null ? defintion.Class : defintion.Property;
      this.service.getConcept(iri).subscribe(
        (result) => defintion.concept = result,
        (error) => this.log.error(error)
      );
    });
  }

}
