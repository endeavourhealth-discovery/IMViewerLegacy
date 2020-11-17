import { ConceptReferenceNode } from './../../models/objectmodel/ConceptReferenceNode';
import { LoggerService } from 'dds-angular8';
import { NgEventBus } from 'ng-event-bus';
import { ConceptService } from './../../services/concept.service';
import { Concept } from './../../models/objectmodel/Concept';
import { Component, OnInit, Input } from '@angular/core';
import { ConceptReference } from 'src/app/models/objectmodel/ConceptReference';

@Component({
  selector: 'app-concept-hierarchy-view',
  templateUrl: './concept-hierarchy-view.component.html',
  styleUrls: ['./concept-hierarchy-view.component.scss']
})
export class ConceptHierarchyViewComponent implements OnInit {

  @Input() root: string;
  @Input() concept: Concept;
  parents: Set<ConceptReference>;
  children: Set<ConceptReferenceNode>;

  constructor(private service: ConceptService,
    private log: LoggerService,
    private eventBus: NgEventBus) { }

  ngOnInit() {
    this.service.getConceptChildren(this.concept.iri).subscribe(
      (result) => this.children = result,
      (error) => { this.log.error(error); }
    );

    this.service.getConceptParents(this.concept.iri).subscribe(
      (result) => this.parents = result,
      (error) => { this.log.error(error); }
    );
  }

}
