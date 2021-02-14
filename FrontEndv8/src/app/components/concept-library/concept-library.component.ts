import { Perspective } from 'src/app/models/Perspective';
import { ConceptReferenceNode } from 'src/app/models/objectmodel/ConceptReferenceNode';
import { Concept } from './../../models/objectmodel/Concept';
import { ConceptService } from 'src/app/services/concept.service';
import { Perspectives } from 'src/app/services/perspective.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from 'src/app/services/logger.service';
import { NgEventBus } from 'ng-event-bus';
import { Component, Input, OnInit } from '@angular/core';
import { ConceptReference } from 'src/app/models/objectmodel/ConceptReference';

@Component({
  selector: 'app-concept-library',
  templateUrl: './concept-library.component.html',
  styleUrls: ['./concept-library.component.scss']
})
export class ConceptLibraryComponent implements OnInit {

  constructor(private service: ConceptService,
    private perspectiveService: Perspectives,
    public perspectives: Perspectives,
    private router: Router,
    private route: ActivatedRoute,
    private log: LoggerService,
    private eventBus: NgEventBus) { }

    @Input() concept: Concept | any;
    @Input()parents: Array<ConceptReferenceNode>;
    @Input()children: Array<ConceptReferenceNode>;
    mappedFrom: Array<ConceptReference>;
    mappedTo: Array<ConceptReference>;
    @Input()perspective: Perspective;
    @Input() relationships = ['sn:116680003']; // this can move to the perspective

  ngOnInit() {
  }

  ngOnChanges(): void {
    this.perspective = this.perspectiveService.getPerspectiveByConceptType(this.concept.conceptType);
/*
    this.perspectiveService.getPerspective(this.concept.iri).subscribe(
      (result) => this.perspective = result,
      (error) => this.log.error(error)
    );
*/

    this.service.findMappedFrom(this.concept.iri).subscribe(
      (result) => this.mappedFrom = result,
      (error) => this.log.error(error)
    );

    this.service.findMappedTo(this.concept.iri).subscribe(
      (result) => this.mappedTo = result,
      (error) => this.log.error(error)
    );
  }

  nodeClick(iri: string) {
    this.eventBus.cast('app:conceptSelect', iri);
  }

  isMemberOf(conceptIri: string) {
    this.service.isValuesetMember(conceptIri, this.concept.iri).subscribe(
      (result) => {
        if (!result.includedBy)
          alert('Not included in this value set');
        else if (!result.excludedBy)
          alert('Included as descendant of [' + result.includedBy.name + ']');
        else
          alert('Included as descendant of [' + result.includedBy.name + ']\nbut further excluded as descendant of [' + result.excludedBy.name + ']');
      },
      (error) => this.log.error(error)
    );
  }

}
