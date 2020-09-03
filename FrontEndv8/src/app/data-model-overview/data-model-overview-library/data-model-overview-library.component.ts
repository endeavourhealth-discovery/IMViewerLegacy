import { Related } from './../../models/Related';
import { PagedResultSet } from './../../models/PagedResultSet';
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

  DM_HealthEvent: PagedResultSet<Related>;
  DM_IdentifiableEntity: PagedResultSet<Related>;
  DM_Provenance: PagedResultSet<Related>;
  DM_StateEntry: PagedResultSet<Related>;
  DM_StructuredArtefact: PagedResultSet<Related>;

  constructor(private service: ConceptService, private log: LoggerService, private router: Router) { }

  ngOnInit() {

    this.service.getSources(':DM_HealthEvent', null, 20, 1).subscribe(
      (result) => this.DM_HealthEvent = result,
      (error) => this.log.error(error)
    );

    this.service.getSources(':DM_IdentifiableEntity', null, 20, 1).subscribe(
      (result) => this.DM_IdentifiableEntity = result,
      (error) => this.log.error(error)
    );

    this.service.getSources(':DM_Provenance', null, 20, 1).subscribe(
      (result) => this.DM_Provenance = result,
      (error) => this.log.error(error)
    );

    this.service.getSources(':DM_StateEntry', null, 20, 1).subscribe(
      (result) => this.DM_StateEntry = result,
      (error) => this.log.error(error)
    );

    this.service.getSources(':DM_StructuredArtefact', null, 20, 1).subscribe(
      (result) => this.DM_StructuredArtefact = result,
      (error) => this.log.error(error)
    );


  }

  goto(iri: string) {
    this.router.navigate(['dataModel'], {queryParams: {id: iri}});
  }

  getDataModelViewUrl(dataModelIri: string): string {
    return "/#/dataModel?id=" + dataModelIri;
  }

}
