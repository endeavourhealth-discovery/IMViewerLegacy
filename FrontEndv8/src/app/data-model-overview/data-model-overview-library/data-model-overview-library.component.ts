import { Related } from './../../models/old/Related';
import { PagedResultSet } from './../../models/old/PagedResultSet';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { LoggerService } from 'dds-angular8/logger';
import { ConceptService } from '../../services/concept.service';
import { ConceptGroup } from '../../models/old/ConceptGroup';

const debug = (message: string) => { console.log(message); };

@Component({
  selector: 'app-data-model-overview-library',
  templateUrl: './data-model-overview-library.component.html',
  styleUrls: ['./data-model-overview-library.component.scss']
})
export class DataModelOverviewLibraryComponent implements OnInit {
  concepts = [];

  constructor(private service: ConceptService, private log: LoggerService, private router: Router) { }

  ngOnInit() {

    this.service.getSources(':HealthRecord', null, 20, 1).subscribe(
      (result) => this.populateConcepts(result),
      (error) => this.log.error(error)
    );

  }

  populateConcepts(dataModelConcept: PagedResultSet<Related>) {
    dataModelConcept.result.forEach(entry => {
      const concept = {
        name: entry.concept.name,
        description: entry.concept.description,
        iri: entry.concept.iri,
        sources: []
      };

      this.service.getSources(entry.concept.iri, null, 20, 1).subscribe(
        (result) => concept.sources = result.result,
        (error) => this.log.error(error)
      );

      this.concepts.push(concept);
    });
  }

  goto(iri: string) {
    this.router.navigate(['dataModel'], {queryParams: {id: iri}});
  }

  getDataModelViewUrl(dataModelIri: string): string {
    return "/#/dataModel?id=" + dataModelIri;
  }

}
