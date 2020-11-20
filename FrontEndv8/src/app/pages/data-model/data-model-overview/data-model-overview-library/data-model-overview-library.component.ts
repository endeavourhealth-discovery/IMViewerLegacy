import { ConceptReferenceNode } from './../../../../models/objectmodel/ConceptReferenceNode';
import { ConceptService } from './../../../../services/concept.service';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { LoggerService } from 'dds-angular8/logger';

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

    this.service.getConceptChildren(':HealthRecord').subscribe(
      (result) => this.populateConcepts(result),
      (error) => this.log.error(error)
    );

  }

  populateConcepts(dataModelConcept: Array<ConceptReferenceNode>) {
    dataModelConcept.forEach(entry => {
      const concept = {
        name: entry.name,
        description: "",
        iri: entry.iri,
        sources: new Array<ConceptReferenceNode>()
      };

      this.service.getConceptChildren(entry.iri).subscribe(
        (result) => concept.sources = result,
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
