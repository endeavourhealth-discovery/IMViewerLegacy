import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { LoggerService } from 'dds-angular8/logger';
import { ConceptService } from '../../concept.service';
import { ConceptGroup } from '../../models/ConceptGroup';

const debug = (message: string) => { console.log(message); };

@Component({
  selector: 'app-data-model-overview-library',
  templateUrl: './data-model-overview-library.component.html',
  styleUrls: ['./data-model-overview-library.component.scss']
})
export class DataModelOverviewLibraryComponent implements OnInit {

  dataModelConceptGroups: ConceptGroup[];

  constructor(private service: ConceptService, private log: LoggerService, private router: Router) { }

  ngOnInit() {
    this.service.getConceptGroups(':DM_DataModel').subscribe(
      (result) => this.dataModelConceptGroups = result,
      (error) => this.log.error(error)
    );
  }

  getDataModelViewUrl(dataModelIri: string): string {
    return "/#/dataModel?id=" + dataModelIri;
  }

}
