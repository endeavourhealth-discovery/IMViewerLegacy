import { ConceptReferenceNode } from '../../../models/objectmodel/ConceptReferenceNode';
import { ConceptService } from '../../../services/concept.service';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {LoggerService} from '../../../services/logger.service';
import {Perspectives} from '../../../services/perspective.service';

const debug = (message: string) => { console.log(message); };

@Component({
  selector: 'app-health-record-overview-library',
  templateUrl: './health-record-overview-library.component.html',
  styleUrls: ['./health-record-overview-library.component.scss']
})
export class HealthRecordOverviewLibraryComponent implements OnInit {
  concepts = [];

  constructor(private service: ConceptService, private log: LoggerService, private router: Router, private perspectives:Perspectives) { }

  ngOnInit() {
    this.perspectives.current = this.perspectives.current;
    this.service.getConceptChildren(':HealthRecord').subscribe(
      (result) => this.populateConcepts(result),
      (error) => this.log.error(error)
    );

  }

  populateConcepts(healthRecordConcept: Array<ConceptReferenceNode>) {
    healthRecordConcept.forEach(entry => {
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
    this.router.navigate([this.perspectives.healthRecord.primary.state, iri]);
  }

  getHealthRecordViewUrl(healthRecordIri: string): string {
    return "/#/healthRecord?id=" + healthRecordIri;
  }

}
