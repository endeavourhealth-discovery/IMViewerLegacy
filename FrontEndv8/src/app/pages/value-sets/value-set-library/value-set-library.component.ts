import { Perspective } from 'src/app/models/Perspective';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgEventBus } from 'ng-event-bus';
import { forkJoin, Observable, ReplaySubject, Subject } from 'rxjs';
import { ConceptTreeController, ConceptTreeSelection } from '../../../common/ConceptTreeController';
import { ConceptView, HistoryItem } from '../../../common/ConceptView';
import { Concept } from '../../../models/objectmodel/Concept';
import { ConceptReference } from '../../../models/objectmodel/ConceptReference';
import { ConceptReferenceNode } from '../../../models/objectmodel/ConceptReferenceNode';
import { ConceptAggregate, ConceptService } from '../../../services/concept.service';
import { LoggerService } from '../../../services/logger.service';
import { Perspectives } from '../../../services/perspective.service';
import { ValueSet, ValueSetService } from '../../../services/valueset.service';
import { valueSetServiceProvider } from '../../../services/valueset.service.provider';

@Component({
  selector: 'app-value-set-library',
  templateUrl: './value-set-library.component.html',
  styleUrls: ['./value-set-library.component.scss'],
  providers: [ valueSetServiceProvider ],
})
export class ValueSetLibraryComponent implements OnInit {
  concept: Concept;
  parents: Array<ConceptReferenceNode>;
  children: Array<ConceptReferenceNode>;
  perspective: Perspective;
  selectedConcept: Concept;
  treeController: ConceptTreeController;
  conceptView: ConceptView;
  relationships = ['sn:116680003'];
  history = [];
  busy = false;

  constructor(private service: ConceptService,
              private valueSetService: ValueSetService,
              public perspectives: Perspectives,
              private perspectiveService: Perspectives,
              private router: Router,
              private route: ActivatedRoute,
              private log: LoggerService,
              private eventBus: NgEventBus) {

    this.conceptView = new ConceptView(service, perspectives, log, router, route, perspectives.valueSets);
    this.conceptView.onNavigationStart(this.onConceptAggregateChange.bind(this), this.onError.bind(this) )
    this.conceptView.onNavigationEnd(this.onHistoryChange.bind(this), this.onError.bind(this) )
  }

  ngOnInit() {
    this.conceptView.init();
  }

  get selectedIri() {
    return this.concept.iri;
  }

  private onConceptAggregateChange(conceptAggregate: ConceptAggregate): void {
    if(conceptAggregate != null) {
      // need to check if it's a valuset
      if(this.valueSetService.isValueSet(conceptAggregate.concept)) {
        this.concept = conceptAggregate.concept;
        this.children = conceptAggregate.children;
        this.parents = conceptAggregate.parents;
        this.perspectiveService.getPerspective(this.selectedIri).subscribe(
          (result) => this.perspective = result,
          (error) => this.log.error(error)
        );
      }
      else {
        // error time
      }
    }
    else {
      this.log.debug("onConceptAggregateChange - ConceptAggregate is null");
    }
  }

  private onHistoryChange(history: Array<HistoryItem>): void {
    this.history = history;
  }

  private onError(error: any): void {
    this.log.error(error);
  }
}


